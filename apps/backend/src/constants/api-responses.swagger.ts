import { ApiResponseOptions } from '@nestjs/swagger';
import {
    ACCESS_TOKEN_INVALID,
    DB_OPERATION_FAILED,
    DEACTIVATE_OWN_ACCOUNT_ONLY,
    EMAIL_NOT_VERIFIED,
    EMAIL_VERIFICATION_FAILED,
    INVALID_CREDENTIALS_MSG,
    LOGOUT_SUCCESS_MSG,
    REFRESH_TOKEN_INVALID,
    REGISTRATION_CONFIRMED_MESSAGE,
    REGISTRATION_SUCCESS,
    USER_ALREADY_EXISTS,
    USER_DEACTIVATED_SUCCESS,
    USER_NOT_AUTHORIZED,
    VERIFICATION_TOKEN_NVALID,
} from './api-messages.constants';

// auth
export const DATABASE_ERROR_RESPONSE: ApiResponseOptions = {
    status: 500,
    description: 'Ошибка доступа к базе данных. Сервер БД недоступен',
    schema: {
        example: {
            success: false,
            statusCode: 500,
            data: {
                message: DB_OPERATION_FAILED,
            },
        },
    },
};

export const EMAIL_VERIFICATION_FAILED_RESPONSE: ApiResponseOptions = {
    status: 500,
    description:
        'Ошибка отправки письма поьзователю для подтверждения регистрации',
    schema: {
        example: {
            success: false,
            statusCode: 500,
            data: {
                message: EMAIL_VERIFICATION_FAILED,
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
                message: REGISTRATION_SUCCESS,
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
                message: USER_ALREADY_EXISTS,
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
                userProfile: {
                    name: 'user1',
                    email: '1@test.test',
                    phone: '89775465522',
                    role: 'USER',
                },
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
                message: INVALID_CREDENTIALS_MSG,
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
                message: LOGOUT_SUCCESS_MSG,
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
                userProfile: {
                    name: 'user1',
                    email: '1@test.test',
                    phone: '89775465522',
                    role: 'USER',
                },
            },
        },
    },
};

export const REFRESH_INVALID: ApiResponseOptions = {
    status: 401,
    description: 'RefreshToken недействителен, просрочен или пустой',
    schema: {
        example: {
            success: false,
            statusCode: 401,
            data: {
                message: REFRESH_TOKEN_INVALID,
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
    description: 'Неавторизованный доступ (отсутсвует в header Authorization)',
    schema: {
        example: {
            success: false,
            statusCode: 401,
            data: { message: USER_NOT_AUTHORIZED },
        },
    },
};

export const HEALTH_CHECK_API: ApiResponseOptions = {
    status: 200,
    description: 'Успешное соединение',
    schema: {
        example: {
            success: true,
            statusCode: 200,
            data: {
                status: 'ok',
                service: 'Monitorium Backend',
            },
        },
    },
};

export const SERVER_ERROR_RESPONSES_REGISTR: ApiResponseOptions = {
    status: 500,
    description: 'Ошибки на стороне сервера',
    content: {
        'application/json': {
            examples: {
                UsersFound: {
                    summary:
                        'Ошибка доступа к базе данных. Сервер БД недоступен',
                    value: {
                        success: false,
                        statusCode: 500,
                        data: {
                            message: DB_OPERATION_FAILED,
                        },
                    },
                },
                UserFoundByEmail: {
                    summary: 'Ошибка отправки письма пользователю',
                    value: {
                        success: false,
                        statusCode: 500,
                        data: {
                            message: EMAIL_VERIFICATION_FAILED,
                        },
                    },
                },
            },
        },
    },
};

export const REGISTRATION_CONFIRMED_RESPONSE: ApiResponseOptions = {
    status: 200,
    description: 'Регистрация успешно подтверждена',
    schema: {
        example: {
            success: true,
            statusCode: 200,
            data: {
                message: REGISTRATION_CONFIRMED_MESSAGE,
            },
        },
    },
};

export const INVALID_TOKEN_RESPONSE: ApiResponseOptions = {
    status: 404,
    description: 'Неверный или просроченный токен',
    schema: {
        example: {
            success: false,
            statusCode: 404,
            data: {
                message: VERIFICATION_TOKEN_NVALID,
            },
        },
    },
};

export const DEACTIVATE_OWN_ACCOUNT_ERROR_RESPONSE: ApiResponseOptions = {
    status: 403,
    description: 'Попытка дективации чужой учетной записи',
    schema: {
        example: {
            success: false,
            statusCode: 403,
            data: {
                message: DEACTIVATE_OWN_ACCOUNT_ONLY,
            },
        },
    },
};

export const EMAIL_NOT_VERIFIED_CONFLICT_RESPONSE: ApiResponseOptions = {
    status: 409,
    description: 'Регистрация не завершена: email не подтвержден',
    schema: {
        example: {
            success: false,
            statusCode: 409,
            data: {
                message: EMAIL_NOT_VERIFIED,
            },
        },
    },
};

export const INVALID_ACCESS_TOKEN_RESPONSE: ApiResponseOptions = {
    status: 401,
    description: 'Неудачная попытка деактивации',
    schema: {
        example: {
            success: false,
            statusCode: 401,
            data: {
                message: ACCESS_TOKEN_INVALID,
            },
        },
    },
};

export const USER_ACCOUNT_DEACTIVATED_RESPONSE: ApiResponseOptions = {
    status: 200,
    description: 'Удачная попытка деактивации',
    schema: {
        example: {
            success: true,
            statusCode: 200,
            data: {
                message: USER_DEACTIVATED_SUCCESS,
            },
        },
    },
};

export const AUTHENTICATION_ERROR_RESPONSES: ApiResponseOptions = {
    status: 401,
    description: 'Ошибки доступа: невалидный токен или отсутствие авторизации',
    content: {
        'application/json': {
            examples: {
                UsersFound: {
                    summary: 'Невалидный токен доступа',
                    value: {
                        success: false,
                        statusCode: 401,
                        data: {
                            message: ACCESS_TOKEN_INVALID,
                        },
                    },
                },
                UserFoundByEmail: {
                    summary:
                        'Неавторизованный доступ (отсутсвует в header Authorization)',
                    value: {
                        success: false,
                        statusCode: 401,
                        data: { message: USER_NOT_AUTHORIZED },
                    },
                },
            },
        },
    },
};
