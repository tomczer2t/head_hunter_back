import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { emailConfiguration } from './configuration';
import * as Joi from 'joi';
import { EmailConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [emailConfiguration],
      validationSchema: Joi.object({
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        EMAIL_HOST: Joi.string().required(),
        EMAIL_PORT: Joi.number().required(),
        EMAIL_FROM: Joi.string().required(),
      }),
    }),
  ],
  providers: [EmailConfigService, ConfigService],
  exports: [EmailConfigService, ConfigService],
})
export class EmailConfigModule {}
