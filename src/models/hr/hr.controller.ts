import { Controller, Get, Inject, Post } from '@nestjs/common';
import { HrService } from './hr.service';

@Controller('hr')
export class HrController {
  constructor(@Inject(HrService) private hrService: HrService) {}

  @Post('url-registration')
  urlRegistration() {
    this.hrService.urlRegistration();
  }

  // @Get('/students')
  // async allInterviewsFromOneHr() {
  //   const hrId = '';
  //   return this.hrService.allInterviewsFromOneHr(hrId);
  // }
}
