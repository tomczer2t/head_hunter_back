import { Module } from '@nestjs/common';
import { HrService } from './hr.service';
import { HrController } from './hr.controller';
import { StudentModule } from '../student/student.module';

@Module({
  controllers: [HrController],
  providers: [HrService],
})
export class HrModule {}
