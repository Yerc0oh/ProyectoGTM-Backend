import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Exportamos el servicio para que pueda ser utilizado en otros módulos (como AuthModule)
})
export class UsersModule {}
