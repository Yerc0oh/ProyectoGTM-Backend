import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendMail(options: {
    to: string;
    subject: string;
    html: string;
  }) {
    const result = await this.resend.emails.send({
      from: process.env.MAIL_FROM!,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log(`RESEND RESPONSE:`, result);
    return result;
  }

  async enviarPrueba(destino: string) {
    return this.sendMail({
      to: destino,
      subject: 'Prueba de correo',
      html: '<h1>Hola 👋 Resend funcionando</h1>',
    });
  }
}