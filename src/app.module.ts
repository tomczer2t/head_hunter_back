import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { MysqlProviderModule } from './providers/mysql/provider.module';
import { EmailProviderModule } from './providers/email/provider.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './models/user/user.module';
import { AdminModule } from './models/admin/admin.module';
import { HrModule } from './models/hr/hr.module';

@Module({
  imports: [
    AppConfigModule,
    MysqlProviderModule,
    EmailProviderModule,
    AuthModule,
    UserModule,
    AdminModule,
    HrModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
