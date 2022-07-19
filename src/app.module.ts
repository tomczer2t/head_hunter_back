import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { MysqlProviderModule } from './providers/mysql/provider.module';

@Module({
  imports: [AppConfigModule, MysqlProviderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
