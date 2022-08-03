import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseCsvPipe, StudentsCsvValidatorPipe } from '../../common/pipes';
import { AddStudentsResponse, StudentCsv, UserRole } from '../../../types';
import { fileCsvFilter } from '../../common/utils';
import { SetAccessRole } from '../../common/decorators';
import { HrFormRegistrationDto } from './dto/hr-form-registration.dto';

@SetAccessRole(UserRole.ADMIN)
@Controller('/admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @UseInterceptors(FileInterceptor('students', { fileFilter: fileCsvFilter }))
  @Post('/import-students')
  addStudents(
    @UploadedFile(ParseCsvPipe, StudentsCsvValidatorPipe)
    students: StudentCsv[],
  ): Promise<AddStudentsResponse> {
    return this.adminService.addStudents(students);
  }

  @Post('/hr')
  addHr(@Body() hrDto: HrFormRegistrationDto) {
    return this.adminService.addHr(hrDto);
  }
}
