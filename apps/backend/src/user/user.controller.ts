import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
    ApiHeader,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@src/auth/guards/access.guard';
import {
    DATABASE_ERROR_RESPONSE,
    UNAUTHORIZED_ACCESS_RESPONSE,
    USER_LIST_SUCCESS_RESPONSE,
    USER_NOT_FOUND_RESPONSE,
} from '@src/constants/api-responses.swagger';
import { User, UserResponse } from '@src/types/user';
import { UserService } from './user.service';

@Controller({
    path: 'users',
    version: '1',
})
@ApiTags('Пользователи')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Получить всех пользователей или найти по email' })
    @ApiHeader({
        name: 'Authorization',
        description: 'JWT токен в формате Bearer <token>',
        required: true,
    })
    @ApiQuery({
        name: 'email',
        description: 'Опциональный email для поиска конкретного пользователя',
        required: false,
        type: String,
        example: '/api/v1/users?email="user1@test.test"',
    })
    @ApiResponse(USER_LIST_SUCCESS_RESPONSE)
    @ApiResponse(UNAUTHORIZED_ACCESS_RESPONSE)
    @ApiResponse(DATABASE_ERROR_RESPONSE)
    async getUsers(
        @Query('email') email?: string,
    ): Promise<UserResponse[] | User | null> {
        if (email) {
            return this.userService.findUserByEmail(email);
        }
        return this.userService.getAllUsers();
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Получить пользователя по Id' })
    @ApiHeader({
        name: 'Authorization',
        description: 'JWT токен в формате Bearer <token>',
        required: true,
    })
    @ApiParam({
        name: 'id',
        description: 'Обязательный параметр',
        required: true,
        type: String,
        example: '/api/v1/users/cmik6d2sm0000mojf4oz1jraa',
    })
    @ApiResponse(USER_NOT_FOUND_RESPONSE)
    @ApiResponse(UNAUTHORIZED_ACCESS_RESPONSE)
    @ApiResponse(DATABASE_ERROR_RESPONSE)
    async findUserById(@Param('id') id: string): Promise<User | null> {
        return this.userService.findUserById(id);
    }
}
