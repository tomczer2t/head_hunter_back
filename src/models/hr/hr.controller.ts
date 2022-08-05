import { Body, Controller, Get, Inject, Patch, Post } from '@nestjs/common';
import { HrService } from './hr.service';
import { GetUser, SetAccessRole } from '../../common/decorators';
import { UserRole } from '../../../types';
import { UserEntity } from '../user/entities';
import { AddStudentToInterviewDto } from './dto/add-student-to-interview.dto';
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
    @Body() { userId }: AddStudentToInterviewDto,
  ) {
    return this.hrService.addStudentToInterview(userId, hr);
  }

  @Patch('/')
  updateHrInfo(
    @Body() hrFormProfileDto: HrFormProfileDto,
    @GetUser() { hrInfo }: UserEntity,
  ) {
    return this.hrService.updateHrInfo(hrFormProfileDto, hrInfo);
  }
}
