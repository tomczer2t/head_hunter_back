import { Body, Controller, Post } from '@nestjs/common';
import { HrService } from './hr.service';

@Controller('hr')
export class HrController {
  constructor(private hrService: HrService) {}

  @Post('url-registration')
  urlRegistration() {
    this.hrService.urlRegistration();
  }
}
