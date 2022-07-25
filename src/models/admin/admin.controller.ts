import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseCsvPipe } from '../../common/pipes';
import { StudentCsv } from '../../../types';
import { fileCsvFilter } from '../../common/utils';

@Controller('/admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @UseInterceptors(FileInterceptor('students', { fileFilter: fileCsvFilter }))
  @Post('/import-students')
  addStudents(@UploadedFile(ParseCsvPipe) students: StudentCsv[]) {
    return this.adminService.addStudents(students);
  }
}
