import { Module } from '@nestjs/common';
import { HrService } from './hr.service';
import { HrController } from './hr.controller';
import { UserModule } from '../user/user.module';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [UserModule, StudentModule],
  controllers: [HrController],
  providers: [HrService],
  exports: [HrService],
})
export class HrModule {}
