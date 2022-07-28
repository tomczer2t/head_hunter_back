import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { UserModule } from '../user/user.module';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [UserModule, StudentModule],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
