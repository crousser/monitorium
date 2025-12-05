import { UserProfile } from '@monorepo/types';
import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    DATABASE_ERROR_RESPONSE,
    LOGIN_VALIDATION_ERROR_RESPONSE,
    LOGOUT_SUCCESS_RESPONSE,
    REFRESH_INVALID,
    REFRESH_SUCCESS_RESPONSE,
    UNAUTHORIZED_LOGIN_RESPONSE,
    USER_CONFLICT_RESPONSE,
    USER_LOGIN_SUCCESS_RESPONSE,
    USER_REGISTER_SUCCESS_RESPONSE,
    VALIDATION_ERROR_RESPONSE,
} from '@src/constants/api-responses.swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller({
    path: 'auth',
    version: '1',
})
@ApiTags('Регистрация/авторизация')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    @Post('register')
    @ApiOperation({ summary: 'Регистрация нового пользователя' })
    @ApiResponse(USER_REGISTER_SUCCESS_RESPONSE)
    @ApiResponse(VALIDATION_ERROR_RESPONSE)
    @ApiResponse(USER_CONFLICT_RESPONSE)
    @ApiResponse(DATABASE_ERROR_RESPONSE)
    async register(
        @Body() registerDto: RegisterDto,
        @Res({ passthrough: true }) response: Response,
    ): Promise<{ accessToken: string; userProfile: UserProfile }> {
        return this.authService.register(registerDto, response);
    }

    @Post('login')
    @ApiOperation({ summary: 'Авторизация пользователя' })
    @ApiResponse(USER_LOGIN_SUCCESS_RESPONSE)
    @ApiResponse(LOGIN_VALIDATION_ERROR_RESPONSE)
    @ApiResponse(LOGIN_VALIDATION_ERROR_RESPONSE)
    @ApiResponse(UNAUTHORIZED_LOGIN_RESPONSE)
    @ApiResponse(DATABASE_ERROR_RESPONSE)
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) response: Response,
    ): Promise<{
        accessToken: string;
        userProfile: UserProfile;
    }> {
        return this.authService.login(loginDto, response);
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Обновление refreshToken' })
    @ApiResponse(REFRESH_SUCCESS_RESPONSE)
    @ApiResponse(REFRESH_INVALID)
    @ApiResponse(DATABASE_ERROR_RESPONSE)
    async refresh(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ): Promise<{
        accessToken: string;
        userProfile: UserProfile;
    }> {
        return this.authService.refresh(request, response);
    }

    @Post('logout')
    @ApiOperation({ summary: 'Выход из приложения' })
    @ApiResponse(LOGOUT_SUCCESS_RESPONSE)
    @ApiResponse(REFRESH_INVALID)
    @ApiResponse(DATABASE_ERROR_RESPONSE)
    async logout(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ): Promise<{
        message: string;
    }> {
        const result = await this.authService.logout(request, response);

        return result;
    }
}
