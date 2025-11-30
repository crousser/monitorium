import { ApiResponseOptions } from '@nestjs/swagger';

// auth
export const DATABASE_ERROR_RESPONSE: ApiResponseOptions = {
    status: 500,
    description: 'Ошибка доступа к базе данных. Сервер БД недоступен.',
    schema: {
        example: {
            success: false,
            statusCode: 500,
            data: {
                message:
                    'Не удалось выполнить операцию с базой данных. Повторите попытку позже.',
            },
        },
    },
};

export const USER_REGISTER_SUCCESS_RESPONSE: ApiResponseOptions = {
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
    schema: {
        example: {
            success: true,
            statusCode: 201,
            data: {
                accessToken: 'eyJhbGciOiJIUzI1NiI...',
                refreshToken: 'eyJhbGciOiJIUzI1NiI...',
            },
        },
    },
};

export const VALIDATION_ERROR_RESPONSE: ApiResponseOptions = {
    status: 400,
    description: 'Ошибка валидации данных при регистрации',
    schema: {
        example: {
            success: false,
            statusCode: 400,
            data: {
                message: [
                    'Имя должно быть не более 50 символов',
                    'Имя должно быть не менее 2 символов',
                    'Имя должно быть строкой',
                    'Email не может быть пустым',
                    'Email должен быть не более 50 символов',
                    'Некорректный email',
                    'Пароль должен содержать минимум 8 символов, одну заглавную букву, одну цифру и один специальный символ',
                    'Пароль не может быть пустым',
                    'Пароль должен быть не более 50 символов',
                    'Пароль должен быть не менее 8 символов',
                    'Пароль должно быть строкой',
                    'Телефон не может быть пустым',
                    'Телефон должен состоять ровно из 11 символов',
                    'Телефон должно быть строкой',
                ],
            },
        },
    },
};

export const USER_CONFLICT_RESPONSE: ApiResponseOptions = {
    status: 409,
    description:
        'Регистрация уже существующего пользователя (email или телефон заняты).',
    schema: {
        example: {
            success: false,
            statusCode: 409,
            data: {
                message: 'Пользователь уже существует.',
            },
        },
    },
};

export const USER_LOGIN_SUCCESS_RESPONSE: ApiResponseOptions = {
    status: 201,
    description: 'Пользователь успешно авторизован',
    schema: {
        example: {
            success: true,
            statusCode: 201,
            data: {
                accessToken: 'eyJhbGciOiJIUzI1NiI...',
                refreshToken: 'eyJhbGciOiJIUzI1NiI...',
            },
        },
    },
};

export const LOGIN_VALIDATION_ERROR_RESPONSE: ApiResponseOptions = {
    status: 400,
    description: 'Ошибка валидации данных при авторизации',
    schema: {
        example: {
            success: false,
            statusCode: 400,
            data: {
                message: [
                    'Email не может быть пустым',
                    'Email должен быть не более 50 символов',
                    'Некорректный email',
                    'Пароль должен содержать минимум 8 символов, одну заглавную букву, одну цифру и один специальный символ',
                    'Пароль не может быть пустым',
                    'Пароль должен быть не более 50 символов',
                    'Пароль должен быть не менее 8 символов',
                    'Пароль должно быть строкой',
                ],
            },
        },
    },
};

export const UNAUTHORIZED_LOGIN_RESPONSE: ApiResponseOptions = {
    status: 409,
    description: 'Неверные данные авторизации',
    schema: {
        example: {
            success: false,
            statusCode: 409,
            data: {
                message: 'Неверный email или пароль',
            },
        },
    },
};

export const LOGOUT_SUCCESS_RESPONSE: ApiResponseOptions = {
    status: 201,
    description: 'Успешный выход пользователя из приложения',
    schema: {
        example: {
            success: true,
            statusCode: 201,
            data: {
                success: true,
            },
        },
    },
};

export const REFRESH_SUCCESS_RESPONSE: ApiResponseOptions = {
    status: 201,
    description: 'Успешное обновление refrechToken',
    schema: {
        example: {
            success: true,
            statusCode: 201,
            data: {
                accessToken: 'eyJhbGciOiJIUzI1NiI...',
                refreshToken: 'eyJhbGciOiJIUzI1NiI...',
            },
        },
    },
};

export const REFRESH_TOKEN_EMPTY_RESPONSE: ApiResponseOptions = {
    status: 400,
    description: 'Oтсутствует или пустой refreshToken',
    schema: {
        example: {
            success: false,
            statusCode: 400,
            data: {
                message: ['RefreshToken токен не должен быть пустым'],
            },
        },
    },
};

export const REFRESH_UNAUTHORIZED_RESPONSE: ApiResponseOptions = {
    status: 401,
    description: 'RefreshToken недействителен или просрочен',
    schema: {
        example: {
            success: true,
            statusCode: 401,
            data: {
                message:
                    'RefreshToken недействителен или срок его действия истек',
            },
        },
    },
};

// user
export const USER_LIST_SUCCESS_RESPONSE: ApiResponseOptions = {
    status: 200,
    description:
        'Если параметр "email" не указан, возвращается список всех пользователей. Если пользователи не найдены возвращается null.',
    content: {
        'application/json': {
            examples: {
                UsersFound: {
                    summary: 'Ответ со списком всех пользователей',
                    value: {
                        success: true,
                        statusCode: 200,
                        data: [
                            {
                                id: 'cmik6d2sm0000mojf4oz1jraa',
                                name: 'user1',
                                email: '1@test.test',
                                role: 'USER',
                            },
                            {
                                id: 'cmik6d2sm0000mojf4oz1jrbb',
                                name: 'user2',
                                email: '2@test.test',
                                role: 'USER',
                            },
                        ],
                    },
                },
                UserFoundByEmail: {
                    summary: 'Ответ с одним найденным пользователем по email',
                    value: {
                        success: true,
                        statusCode: 200,
                        data: {
                            id: 'cmik6d2sm0000mojf4oz1jraa',
                            name: 'user1',
                            email: '1@test.test',
                            role: 'USER',
                        },
                    },
                },
                UserNotFound: {
                    summary: 'Пользователи не найдены',
                    value: {
                        success: true,
                        statusCode: 200,
                        data: null,
                    },
                },
            },
        },
    },
};

export const USER_NOT_FOUND_RESPONSE: ApiResponseOptions = {
    status: 200,
    description: 'Если указан несуществующий id вернется null',
    content: {
        'application/json': {
            examples: {
                UserFoundById: {
                    summary: 'Ответ с одним найденным пользователем по id',
                    value: {
                        success: true,
                        statusCode: 200,
                        data: {
                            id: 'cmik6d2sm0000mojf4oz1jraa',
                            name: 'user1',
                            email: '1@test.test',
                            role: 'USER',
                        },
                    },
                },
                UserNotFound: {
                    summary: 'Пользователь не найден',
                    value: {
                        success: true,
                        statusCode: 200,
                        data: null,
                    },
                },
            },
        },
    },
};

export const UNAUTHORIZED_ACCESS_RESPONSE: ApiResponseOptions = {
    status: 401,
    description: 'Неавторизованный доступ',
    schema: {
        example: {
            success: false,
            statusCode: 401,
            data: { message: 'Пользователь не авторизован' },
        },
    },
};
