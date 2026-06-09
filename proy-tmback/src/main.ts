import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.enableCors({
    origin: ['http://localhost:5173', process.env.FRONTEND_URL],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

}
bootstrap();

