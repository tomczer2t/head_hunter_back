import { Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('/admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('/import-students')
  importStudents() {
    return this.adminService.importStudents();
  }
}
