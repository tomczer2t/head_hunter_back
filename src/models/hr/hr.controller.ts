import { Body, Controller, Post } from '@nestjs/common';
import { HrUrlRegistrationDto } from './dto/hr-url-registration.dto';
import { HrService } from './hr.service';

@Controller('hr')
export class HrController {
  constructor(private hrService: HrService) {}

  @Post('url-registration')
  urlRegistration(@Body() hrUrlRegistrationDto: HrUrlRegistrationDto) {
    this.hrService.urlRegistration(hrUrlRegistrationDto);
  }
}
