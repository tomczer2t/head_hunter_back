import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { MysqlProviderModule } from './providers/mysql/provider.module';
import { EmailProviderModule } from './providers/email/provider.module';

@Module({
  imports: [AppConfigModule, MysqlProviderModule, EmailProviderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
