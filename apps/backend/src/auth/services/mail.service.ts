import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587', 10),
            secure: true, // true для 465, false для других портов
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async sendVerificationEmail(
        recipientEmail, // почта пользователя, потом добавить в 'to'
        activationLink,
    ): Promise<boolean> {
        const verificationUrl = `${process.env.API_URL}/api/v1/auth/confirm?token=${activationLink}`;

        const mailOptions = {
            from: `"МОНИТОРИУМ" <${process.env.EMAIL_USER}>`,
            to: `${process.env.EMAIL_USER}`,
            subject: 'Подтверждение регистрации',
            html: `
                <h1>Добро пожаловать!</h1>
                <p>Пожалуйста, перейдите по ссылке ниже, чтобы подтвердить ваш адрес электронной почты:</p>
                <p><a href="${verificationUrl}">Подтвердить мой email</a></p>
                <p>Если вы не регистрировались, просто проигнорируйте это письмо.</p>
            `,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Письмо отправлено:', info.messageId);
            return true;
        } catch (error) {
            console.error('Ошибка отправки письма:', error);
            return false;
        }
    }
}
