import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailConfigModule } from '../../config/email/config.module';
import { EmailConfigService } from '../../config/email/config.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { EmailProviderService } from './provider.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [EmailConfigModule],
      useFactory: async (emailConfigService: EmailConfigService) => ({
        transport: `smtp://${emailConfigService.user}:${emailConfigService.password}@${emailConfigService.host}:${emailConfigService.port}`,
        defaults: {
          from: emailConfigService.from,
        },
        // set to true will open a preview of the email with the browser
        preview: false,
        template: {
          dir: './templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [EmailConfigService],
    } as MailerAsyncOptions),
  ],
  providers: [EmailProviderService],
  exports: [EmailProviderService],
})
export class EmailProviderModule {}
