import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {

  constructor(
    private readonly mailService: MailService,
  ) {}

  @Get('test')
  async test() {

    await this.mailService.enviarPrueba(
      'abedcalderonq@gmail.com',
    );

    return {
      mensaje: 'Correo enviado',
    };
  }
  @Get('test-resend')
  async testResend() {
    await this.mailService.enviarPrueba(
      'abedcalderonq@gmail.com',
    );
  }
}