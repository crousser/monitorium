import {
    ConflictException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from '@src/auth/dto/register.dto';
import {
    DB_OPERATION_FAILED,
    DEACTIVATE_OWN_ACCOUNT_ONLY,
    EMAIL_NOT_VERIFIED,
    INVALID_CREDENTIALS_MSG,
    USER_DEACTIVATED_SUCCESS,
    VERIFICATION_TOKEN_NVALID,
} from '@src/constants/api-messages.constants';
import { PrismaService } from '@src/prisma/prisma.service';
import { User, UserResponse } from '@src/types/user';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}
    async getAllUsers(): Promise<UserResponse[]> {
        try {
            return await this.prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            });
        } catch (error) {
            // Логирование фактической ошибки (Надо настроить логер)
            console.error('Ошибка getAllUsers:', error);

            throw new InternalServerErrorException(DB_OPERATION_FAILED);
        }
    }

    async findUserById(id: string): Promise<User | null> {
        try {
            return (
                (await this.prisma.user.findUnique({ where: { id } })) || null
            );
        } catch (error) {
            // Логирование фактической ошибки (Надо настроить логер)
            console.error('Ошибка findUserById:', error);

            throw new InternalServerErrorException(DB_OPERATION_FAILED);
        }
    }

    async findUserByEmail(email: string): Promise<User | null> {
        try {
            return (
                (await this.prisma.user.findUnique({
                    where: { email },
                })) || null
            );
        } catch (error) {
            // Логирование фактической ошибки (Надо настроить логер)
            console.error('Ошибка findUserByEmail:', error);

            throw new InternalServerErrorException(DB_OPERATION_FAILED);
        }
    }

    async verifyUserByToken(token: string): Promise<void> {
        try {
            // 1. Поиск пользователя по токену, проверка срока действия и статуса
            const user = await this.prisma.user.findFirst({
                where: {
                    verifyToken: token,
                    verifyExp: {
                        gt: new Date(),
                    },
                    isVerified: false,
                },
            });

            if (!user) {
                throw new NotFoundException(VERIFICATION_TOKEN_NVALID);
            }

            // 2. Активация пользователя и очистка токена
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    isVerified: true,
                    verifyToken: null,
                    verifyExp: null,
                },
            });
        } catch (error) {
            if (error instanceof NotFoundException) throw error;

            throw new InternalServerErrorException(DB_OPERATION_FAILED);
        }
    }

    async validateUserLogin(email: string, password: string): Promise<User> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email },
            });

            if (!user || !user.password) {
                throw new ConflictException(INVALID_CREDENTIALS_MSG);
            }

            if (!user.isVerified) {
                throw new ConflictException(EMAIL_NOT_VERIFIED);
            }

            // Проверка пароля
            const isPasswordValid = await bcrypt.compare(
                password,
                user.password as string,
            );

            if (!isPasswordValid) {
                throw new ConflictException(INVALID_CREDENTIALS_MSG);
            }

            return user;
        } catch (error) {
            if (error instanceof ConflictException) throw error;

            throw new InternalServerErrorException(DB_OPERATION_FAILED);
        }
    }

    async createUser(dto: RegisterDto): Promise<User> {
        const hashed = await bcrypt.hash(dto.password, 10);
        const verificationToken = uuidv4();
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 24);

        try {
            return await this.prisma.user.create({
                data: {
                    ...dto,
                    password: hashed,
                    verifyToken: verificationToken,
                    verifyExp: expiryDate,
                },
            });
        } catch (error) {
            // Логирование фактической ошибки (Надо настроить логер)
            console.error('Ошибка createUser:', error);

            throw new InternalServerErrorException(DB_OPERATION_FAILED);
        }
    }

    // Метод для удаления пользователя (используется для отката при неудачной регистрации)
    async deleteUser(userId: string): Promise<void> {
        try {
            await this.prisma.user.delete({ where: { id: userId } });
        } catch (error) {
            // Логирование фактической ошибки (Надо настроить логер)
            console.error('Ошибка deleteUser:', error);

            throw new InternalServerErrorException(DB_OPERATION_FAILED);
        }
    }

    async findUserByEmailOrPhone(
        email: string,
        phone: string,
    ): Promise<User | null> {
        try {
            return await this.prisma.user.findFirst({
                where: {
                    OR: [{ email }, { phone }],
                },
            });
        } catch (error) {
            // Логирование фактической ошибки (Надо настроить логер)
            console.error('Ошибка deleteUser:', error);

            throw new InternalServerErrorException(DB_OPERATION_FAILED);
        }
    }

    async deactivateUser(
        paramId: string,
        currentUserId: string,
    ): Promise<{ message: string }> {
        if (paramId !== currentUserId) {
            throw new ForbiddenException(DEACTIVATE_OWN_ACCOUNT_ONLY);
        }

        try {
            // 1. Деактивация пользователя (Soft Delete)
            const userUpdate = this.prisma.user.update({
                where: { id: paramId },
                data: {
                    isActive: false,
                    deletedAt: new Date(),
                },
            });

            // 2. Удаление всех токенов пользователя
            const tokensDelete = this.prisma.token.deleteMany({
                where: { userId: paramId },
            });

            // 3. Выполнение обеих операций параллельно
            await this.prisma.$transaction([userUpdate, tokensDelete]);

            return { message: USER_DEACTIVATED_SUCCESS };
        } catch (error) {
            if (error instanceof ForbiddenException) throw error;

            throw new InternalServerErrorException(DB_OPERATION_FAILED);
        }
    }
}
