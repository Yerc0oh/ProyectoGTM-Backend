import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { turnoComprobanteTemplate } from './mail.templates';


@Injectable()
export class MailService {

    constructor(
        private readonly mailer: MailerService,
    ) { }

    async enviarPrueba(
        destino: string,
    ) {
        await this.mailer.sendMail({
            to: destino,

            subject: 'Prueba de correo',

            text: 'Hola, este es un correo de prueba.',
        });
    }

    async sendMail(options: {
        to: string;
        subject: string;
        text?: string;
        html?: string;
    }) {
        return this.mailer.sendMail({
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        });
    }
}