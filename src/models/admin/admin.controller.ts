import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('/admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @UseInterceptors(FileInterceptor('students'))
  @Post('/import-students')
  addStudents(@UploadedFile() studentsFile: Express.Multer.File) {
    return this.adminService.addStudents(studentsFile);
  }
}
