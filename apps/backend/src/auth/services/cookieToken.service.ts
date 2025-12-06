import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class CookieTokenService {
    constructor(private configService: ConfigService) {}

    clearRefreshTokenCookie(response: Response): void {
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
