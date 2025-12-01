import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    DATABASE_ERROR_RESPONSE,
    LOGIN_VALIDATION_ERROR_RESPONSE,
    LOGOUT_SUCCESS_RESPONSE,
    REFRESH_SUCCESS_RESPONSE,
    REFRESH_TOKEN_EMPTY_RESPONSE,
    REFRESH_UNAUTHORIZED_RESPONSE,
    UNAUTHORIZED_LOGIN_RESPONSE,
    USER_CONFLICT_RESPONSE,
    USER_LOGIN_SUCCESS_RESPONSE,
    USER_REGISTER_SUCCESS_RESPONSE,
    VALIDATION_ERROR_RESPONSE,
} from '@src/constants/api-responses.swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';

@Controller({
    path: 'auth',
    version: '1',
})
@ApiTags('Регистрация/авторизация')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Регистрация нового пользователя' })
    @ApiResponse(USER_REGISTER_SUCCESS_RESPONSE)
    @ApiResponse(VALIDATION_ERROR_RESPONSE)
    @ApiResponse(USER_CONFLICT_RESPONSE)
    @ApiResponse(DATABASE_ERROR_RESPONSE)
    async register(@Body() registerDto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Авторизация пользователя' })
    @ApiResponse(USER_LOGIN_SUCCESS_RESPONSE)
    @ApiResponse(LOGIN_VALIDATION_ERROR_RESPONSE)
    @ApiResponse(LOGIN_VALIDATION_ERROR_RESPONSE)
    @ApiResponse(UNAUTHORIZED_LOGIN_RESPONSE)
    @ApiResponse(DATABASE_ERROR_RESPONSE)
    async login(@Body() loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        return this.authService.login(loginDto);
    }

    @Post('logout')
    @ApiOperation({ summary: 'Выход из приложения' })
    @ApiResponse(LOGOUT_SUCCESS_RESPONSE)
    @ApiResponse(REFRESH_TOKEN_EMPTY_RESPONSE)
    @ApiResponse(DATABASE_ERROR_RESPONSE)
    async logout(@Body() LogoutDto: LogoutDto): Promise<{
        success: boolean;
    }> {
        return this.authService.logout(LogoutDto.refreshToken);
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Обновление refreshToken' })
    @ApiResponse(REFRESH_SUCCESS_RESPONSE)
    @ApiResponse(REFRESH_TOKEN_EMPTY_RESPONSE)
    @ApiResponse(REFRESH_UNAUTHORIZED_RESPONSE)
    @ApiResponse(DATABASE_ERROR_RESPONSE)
    async refresh(@Body() refreshDto: RefreshDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        return this.authService.refresh(refreshDto);
    }
}
