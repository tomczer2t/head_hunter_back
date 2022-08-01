import { Controller, Get, Inject, Post } from '@nestjs/common';
import { HrService } from './hr.service';
import { SetAccessRole } from '../../common/decorators';
import { UserRole } from '../../../types';

@SetAccessRole(UserRole.HR)
@Controller('hr')
export class HrController {
  constructor(@Inject(HrService) private hrService: HrService) {}

  @Post('url-registration')
  urlRegistration() {
    this.hrService.urlRegistration();
  }

  @Get('/students')
  async allInterviewsFromOneHr() {
    const hrId = 'user-hr1'; // for testing purposes
    return this.hrService.allInterviewsFromOneHr(hrId);
  }
}
