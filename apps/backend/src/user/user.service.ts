import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DB_OPERATION_FAILED } from '@src/constants/errors.constants';
import { PrismaService } from '@src/prisma/prisma.service';
import { User, UserResponse } from '@src/types/user';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}
    async getAllUsers(): Promise<UserResponse[]> {
        try {
            const users = await this.prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            });
            return users;
        } catch (error) {
            // Логирование фактической ошибки (Надо настроить логер)
            console.error('Ошибка Prisma при получении пользователей:', error);

            throw new InternalServerErrorException(DB_OPERATION_FAILED);
        }
    }

    async findUserById(id: string): Promise<User | null> {
        try {
            const user = await this.prisma.user.findUnique({ where: { id } });

            if (!user) {
                return null;
            }

            return user;
        } catch (error) {
            // Логирование фактической ошибки (Надо настроить логер)
            console.error('Ошибка Prisma при получении пользователей:', error);

            throw new InternalServerErrorException(DB_OPERATION_FAILED);
        }
    }

    async findUserByEmail(email: string): Promise<User | null> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                return null;
            }

            return user;
        } catch (error) {
            // Логирование фактической ошибки (Надо настроить логер)
            console.error('Ошибка Prisma при получении пользователей:', error);

            throw new InternalServerErrorException(DB_OPERATION_FAILED);
        }
    }
}
