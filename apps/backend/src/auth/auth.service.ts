import { UserProfile } from '@monorepo/types';
import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import {
    DB_OPERATION_FAILED,
    EMAIL_VERIFICATION_FAILED,
    LOGOUT_SUCCESS_MSG,
    REFRESH_TOKEN_INVALID,
    REGISTRATION_CONFIRMED_MESSAGE,
    REGISTRATION_SUCCESS,
    USER_ALREADY_EXISTS,
    VERIFICATION_TOKEN_NVALID,
} from '@src/constants/api-messages.constants';
import { UserService } from '@src/user/user.service';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CookieTokenService } from './services/cookieToken.service';
import { MailService } from './services/mail.service';
import { TokenSevice } from './services/token.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private tokenService: TokenSevice,
        private cookieTokenService: CookieTokenService,
        private mailService: MailService,
    ) {}

    // Регистрация
    async register(registerDto: RegisterDto): Promise<{
        message: string;
    }> {
        let createdUser: User | null = null; // Нужно для логики отката

        try {
            // 1. Проверка существования пользователя (Делегирование UserService)
            const existingUser = await this.userService.findUserByEmailOrPhone(
                registerDto.email,
                registerDto.phone,
            );

            if (existingUser) {
                throw new ConflictException(USER_ALREADY_EXISTS);
            }

            // 2. Создание пользователя
            createdUser = await this.userService.createUser(registerDto);

            // 3. Отправка email
            const emailSent = await this.mailService.sendVerificationEmail(
                createdUser.email,
                createdUser.verifyToken,
            );

            if (!emailSent) {
                // Если отправка не удалась, инициируем откат через блок catch
                throw new Error(EMAIL_VERIFICATION_FAILED);
            }

            return { message: REGISTRATION_SUCCESS };
        } catch (error) {
            if (createdUser && error.message === EMAIL_VERIFICATION_FAILED) {
                await this.userService.deleteUser(createdUser.id);

                throw new InternalServerErrorException(
                    EMAIL_VERIFICATION_FAILED,
                );
            }

            if (error instanceof ConflictException) throw error;

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
            // 1. Делегируем всю логику поиска, проверки верификации и пароля в UserService
            const user = await this.userService.validateUserLogin(
                loginDto.email,
                loginDto.password,
            );

            // 2. Успешный вход: генерируем payload
            const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            };

            return this.tokenService.generateTokens(payload, response);
        } catch (error) {
            if (error instanceof ConflictException) throw error;

            throw new InternalServerErrorException(DB_OPERATION_FAILED);
        }
    }

    // Refresh токен
    async refresh(
        request: Request,
        response: Response,
    ): Promise<{ accessToken: string; userProfile: UserProfile }> {
        try {
            const refreshToken = request.cookies['refreshToken'];

            if (!refreshToken) {
                throw new UnauthorizedException(REFRESH_TOKEN_INVALID);
            }

            // 1. Проверка JWT-подписи токена (Остается в AuthService)
            const verifyJwt = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });

            // 2. Найти и удалить старый токен в БД (Делегируется TokenService)
            await this.tokenService.consumeRefreshToken(refreshToken);

            // 3. Генерируем новую пару токенов (Делегируется TokenService)
            const payload = {
                id: verifyJwt.id,
                name: verifyJwt.name,
                email: verifyJwt.email,
                phone: verifyJwt.phone,
                role: verifyJwt.role,
            };

            return await this.tokenService.generateTokens(payload, response);
        } catch (error) {
            if (error instanceof UnauthorizedException) throw error;

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

        try {
            const deletedCount =
                await this.tokenService.deleteTokensByHash(refreshToken);

            if (deletedCount === 0) {
                throw new UnauthorizedException(REFRESH_TOKEN_INVALID);
            }

            this.cookieTokenService.clearRefreshTokenCookie(response);

            return { message: LOGOUT_SUCCESS_MSG };
        } catch (error) {
            if (error instanceof UnauthorizedException) throw error;

            throw new InternalServerErrorException(DB_OPERATION_FAILED);
        }
    }

    // подтверждение регистрации
    async confirmRegistration(token: string): Promise<{ message: string }> {
        if (!token) {
            throw new NotFoundException(VERIFICATION_TOKEN_NVALID);
        }

        try {
            await this.userService.verifyUserByToken(token);
        } catch (error) {
            if (error instanceof NotFoundException) throw error;

            throw new InternalServerErrorException(DB_OPERATION_FAILED);
        }

        return { message: REGISTRATION_CONFIRMED_MESSAGE };
    }
}
