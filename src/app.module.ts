import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { MysqlProviderModule } from './providers/mysql/provider.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './models/users/users.module';
import { AdminModule } from './models/admin/admin.module';
import { HrModule } from './models/hr/hr.module';

@Module({
  imports: [AppConfigModule, MysqlProviderModule, AuthModule, UsersModule, AdminModule, HrModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
