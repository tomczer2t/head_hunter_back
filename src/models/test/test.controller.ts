import { Controller, Delete, Get } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('/test')
export class TestController {
  constructor(private testService: TestService) {}

  @Get('/create-accounts')
  createTestsAccounts() {
    return this.testService.createTestsAccounts();
  }

  @Delete('/remove-all')
  removeAll() {
    return this.testService.removeAll();
  }
}
