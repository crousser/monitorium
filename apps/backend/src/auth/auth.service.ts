import * as crypto from 'crypto';
import { UserProfile } from '@monorepo/types';
import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
    DB_OPERATION_FAILED,
    INVALID_CREDENTIALS_MSG,
    LOGOUT_SUCCESS_MSG,
    REFRESH_TOKEN_INVALID,
    USER_ALREADY_EXISTS,
} from '@src/constants/errors.constants';
import { JwtPayload } from '@src/types/auth';
import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private configService: ConfigService,
    ) {}

    // Регистрация
    async register(
        registerDto: RegisterDto,
        response: Response,
    ): Promise<{
        accessToken: string;
        userProfile: UserProfile;
    }> {
        try {
            const existingUser = await this.prisma.user.findFirst({
                where: {
                    OR: [
                        { email: registerDto.email },
                        { phone: registerDto.phone },
                    ],
                },
            });

            if (existingUser) {
                throw new ConflictException(USER_ALREADY_EXISTS);
            }

            // Используем bcryptjs для хэширования паролей
            const hashed = await bcrypt.hash(registerDto.password, 10);

            const user = await this.prisma.user.create({
                data: { ...registerDto, password: hashed },
            });

            // Надо будет переделать. При регистрации сразу не должны создаваться токены
            return this.generateTokens(
                {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    phone: user.phone,
                    role: user.role,
                },
                response,
            );
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }

            throw new InternalServerErrorException(DB_OPERATION_FAILED);
        }
    }

    // Авторизация
    async login(
        loginDto: LoginDto,
        response: Response,
    ): Promise<{
        accessToken: string;
        userProfile: UserProfile;
    }> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email: loginDto.email },
            });

            if (!user) {
                throw new ConflictException(INVALID_CREDENTIALS_MSG);
            }

            // Проверка пароля
            const isPasswordValid = await bcrypt.compare(
                loginDto.password,
                user.password as string,
            );

            if (!isPasswordValid) {
                throw new ConflictException(INVALID_CREDENTIALS_MSG);
            }

            // Успешный вход
            return this.generateTokens(
                {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                },
                response,
            );
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }

            throw new InternalServerErrorException(DB_OPERATION_FAILED);
        }
    }

    // Refresh токен
    async refresh(
        request: Request,
        response: Response,
    ): Promise<{ accessToken: string; userProfile: UserProfile }> {
        try {
            // 1. Извлечение токена из куки
            const refreshToken = request.cookies['refreshToken'];

            if (!refreshToken) {
                throw new UnauthorizedException(REFRESH_TOKEN_INVALID);
            }

            const verifyJwt = this.jwt.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });

            const hashed = this.hashToken(refreshToken);

            const tokenRecord = await this.prisma.token.findUnique({
                where: { hashedToken: hashed },
            });

            if (!tokenRecord) {
                throw new UnauthorizedException(REFRESH_TOKEN_INVALID);
            }

            // Удаляем старый refresh-токен если он существует
            if (tokenRecord) {
                await this.prisma.token.delete({
                    where: { id: tokenRecord.id },
                });
            }

            // Генерируем новую пару токенов
            return await this.generateTokens(
                {
                    id: verifyJwt.id,
                    name: verifyJwt.name,
                    email: verifyJwt.email,
                    phone: verifyJwt.phone,
                    role: verifyJwt.role,
                },
                response,
            );
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }

            throw new InternalServerErrorException(DB_OPERATION_FAILED);
        }
    }

    // Выход из системы
    async logout(
        request: Request,
        response: Response,
    ): Promise<{
        message: string;
    }> {
        const refreshToken = request.cookies['refreshToken'];

        if (!refreshToken) {
            throw new UnauthorizedException(REFRESH_TOKEN_INVALID);
        }

        const hashed = this.hashToken(refreshToken);

        try {
            const deleteResult = await this.prisma.token.deleteMany({
                where: { hashedToken: hashed },
            });

            if (deleteResult.count === 0) {
                throw new UnauthorizedException(REFRESH_TOKEN_INVALID);
            }

            this.clearRefreshTokenCookie(response);

            return { message: LOGOUT_SUCCESS_MSG };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new InternalServerErrorException(DB_OPERATION_FAILED);
        }
    }

    // Генерация токенов
    private async generateTokens(
        payload: JwtPayload,
        response: Response,
    ): Promise<{
        accessToken: string;
        userProfile: UserProfile;
    }> {
        const accessToken = this.jwt.sign<JwtPayload>(payload, {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.get('JWT_ACCESS_EXPIRES'),
        });

        const refreshToken = this.jwt.sign<JwtPayload>(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES'),
        });

        const decodedToken = this.jwt.decode(refreshToken);

        // Преобразует время истечения срока действия токена
        const expiresAt = new Date(decodedToken.exp * 1000);

        await this.saveRefreshToken(payload.id, refreshToken, expiresAt);

        this.setRefreshTokenCookie(response, refreshToken);

        return {
            accessToken,
            userProfile: {
                name: payload.name,
                email: payload.email,
                phone: payload.phone || '',
                role: payload.role,
            },
        };
    }

    // Сохранение токена в базу
    private async saveRefreshToken(
        userId: string,
        refreshToken: string,
        expiresAt: Date,
    ): Promise<void> {
        const hashed = this.hashToken(refreshToken);

        try {
            await this.prisma.token.create({
                data: {
                    hashedToken: hashed,
                    userId,
                    exp: expiresAt,
                },
            });
        } catch (error) {
            // Логирование фактической ошибки (Надо настроить логер)
            console.error(
                `Не удалось сохранить токен для пользователя ${userId}:`,
                error,
            );

            throw new InternalServerErrorException(DB_OPERATION_FAILED);
        }
    }

    // Хеширование токена перед сохранением в базу данных (с использованием секретного ключа/соли)
    private hashToken(token: string): string {
        return crypto
            .createHmac(
                'sha256',
                this.configService.get('JWT_REFRESH_SALT') || '',
            )
            .update(token)
            .digest('hex');
    }

    // Устанавливает Refresh Token в HTTP-ответ в виде безопасной HttpOnly куки.
    private setRefreshTokenCookie(
        response: Response,
        refreshToken: string,
    ): void {
        const isProduction =
            this.configService.get('ENVIRONMENT') === 'production';
        const refreshExpiresString =
            this.configService.get<string>('JWT_REFRESH_EXPIRES') || '0';
        const refreshExpiresMs = parseInt(refreshExpiresString, 10);

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true, // Защита от XSS-атак
            secure: isProduction, // Только по HTTPS в продакшене
            sameSite: 'strict', // Защита от CSRF-атак
            expires: new Date(Date.now() + refreshExpiresMs),
            path: '/api/v1/auth/refresh', // Должен совпадать с путем установки
        });
    }

    private clearRefreshTokenCookie(response: Response): void {
        const isProduction =
            this.configService.get('ENVIRONMENT') === 'production';

        response.clearCookie('refreshToken', {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            path: '/api/v1/auth/refresh',
        });
    }
}
