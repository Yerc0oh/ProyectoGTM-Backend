import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private logsService: LogsService,
  ) {}

  async login(email: string, password: string, req: any) {

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Password incorrecta');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      rol: user.rol,
    };
    await this.logsService.createLog({
      usuarioId: user.id,
      ip: req.ip,
      browser: req.headers['user-agent'] || 'unknown',
      evento: 'INGRESO',
    });
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.rol,
      },
    };
  }

  async logout(req: any) {
    const userId = req.user.userId;

    await this.logsService.createLog({
      usuarioId: userId,
      ip: req.ip,
      browser: req.headers['user-agent'] || 'unknown',
      evento: 'SALIDA',
    });
    return { message: 'Logout exitoso' };
  }
  
}