import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserModule } from '../user/user.module';
import { EmailProviderModule } from '../../providers/email/provider.module';
import { AppConfigModule } from '../../config/app/config.module';
import { StudentModule } from '../student/student.module';
import { HrModule } from '../hr/hr.module';

@Module({
  imports: [
    UserModule,
    EmailProviderModule,
    AppConfigModule,
    StudentModule,
    HrModule,
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
