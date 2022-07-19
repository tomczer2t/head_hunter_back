import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfiguration } from './configuration';
import { AppConfigService } from './config.service';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfiguration],
      validationSchema: Joi.object({
        APP_NAME: Joi.string(),
        APP_ENV: Joi.string()
          .valid('development', 'production', 'tests')
          .default('development')
          .required(),
        APP_PORT: Joi.number().default(3001),
        APP_URL: Joi.string(),
      }),
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
