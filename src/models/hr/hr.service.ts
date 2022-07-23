import { Injectable } from '@nestjs/common';
import { HrUrlRegistrationDto } from './dto/hr-url-registration.dto';

@Injectable()
export class HrService {
  urlRegistration(hrUrlRegistrationDto: HrUrlRegistrationDto) {
    console.log('hrUrlRegistration test', hrUrlRegistrationDto);
  }
}
