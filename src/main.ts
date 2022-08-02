import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { JwtAccessGuard, RoleGuard } from './common/guards';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(AppConfigService);
  const reflector = new Reflector();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableCors({ credentials: true });
  app.useGlobalGuards(new JwtAccessGuard(reflector));
  app.useGlobalGuards(new RoleGuard(reflector));
  await app.listen(appConfig.port);
}
bootstrap();
