import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Patch,
  Post,
} from '@nestjs/common';
import { HrService } from './hr.service';
import { GetUser, SetAccessRole } from '../../common/decorators';
import { UserRole } from '../../../types';
import { UserEntity } from '../user/entities';
import { StudentOnInterviewDto } from './dto/student-on-interview.dto';
import { HrFormProfileDto } from './dto/hr-form-profile.dto';

@SetAccessRole(UserRole.HR)
@Controller('/hr')
export class HrController {
  constructor(@Inject(HrService) private hrService: HrService) {}

  @Get('/students')
  async allInterviewsFromOneHr(@GetUser() { id: hrId }: UserEntity) {
    return this.hrService.allInterviewsFromOneHr(hrId);
  }

  @Post('/student')
  addStudentToInterview(
    @GetUser() hr: UserEntity,
    @Body() { userId }: StudentOnInterviewDto,
  ) {
    return this.hrService.addStudentToInterview(userId, hr);
  }
  @Delete('/student')
  deleteStudentFromInterview(
    @GetUser() hr: UserEntity,
    @Body() { userId }: StudentOnInterviewDto,
  ) {
    return this.hrService.deleteStudentFromInterview(userId, hr);
  }

  @Patch('/')
  updateHrInfo(
    @Body() hrFormProfileDto: HrFormProfileDto,
    @GetUser() { hrInfo }: UserEntity,
  ) {
    return this.hrService.updateHrInfo(hrFormProfileDto, hrInfo);
  }
}
