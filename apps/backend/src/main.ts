import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from '@shared/filter';
import { TransformInterceptor } from '@shared/interceptor';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);

    // Настройк CORS
    app.enableCors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
        credentials: true,
    });

    // Использование middleware, interceptors
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());

    // Валидация входящих DTO
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.setGlobalPrefix('api', { exclude: ['/'] });

    app.enableVersioning({
        type: VersioningType.URI,
    });

    // Настройка документации Swagger
    const config = new DocumentBuilder()
        .setTitle('Monitorium API')
        .setDescription('Документация для сервиса Monitorium.')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api/v1/docs', app, document);

    // 💡 Применяем middleware для парсинга куки
    app.use(cookieParser());

    // Запуск приложения
    await app.listen((process.env.API_PORT as string) || 3000);
}

bootstrap().catch((error) => {
    console.error('Error starting the application:', error);
    process.exit(1);
});
