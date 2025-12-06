import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ACCESS_TOKEN_INVALID } from '@src/constants/api-messages.constants';
import { UserService } from '@src/user/user.service';
import { NextFunction, Response } from 'express';
import { ExpressRequest } from '../../../src/types/expressRequest.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly userService: UserService,
        private jwt: JwtService,
        private configService: ConfigService,
    ) {}
    async use(
        req: ExpressRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        if (!req.headers.authorization) {
            req.user = undefined;

            next();
            return;
        }

        const token = req.headers.authorization.split(' ')[1];

        try {
            const verifyJwt = this.jwt.verify(token, {
                secret: this.configService.get('JWT_ACCESS_SECRET'),
            });

            const user = await this.userService.findUserById(
                verifyJwt.id as string,
            );

            req.user = user ? user : undefined;
        } catch (error) {
            // Логирование фактической ошибки (Надо настроить логер)
            console.error('Ошибка верификации токена:', error);

            throw new UnauthorizedException(ACCESS_TOKEN_INVALID);
        } finally {
            next();
        }
    }
}
