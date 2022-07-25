import { Injectable } from '@nestjs/common';
import { StudentCsv, UserRole } from '../../../types';
import { UserEntity } from './entities';
import { v4 as uuid } from 'uuid';
import { StudentService } from '../student/student.service';

@Injectable()
export class UserService {
  constructor(private studentService: StudentService) {}

  async addStudentFromCsvFile(studentCsv: StudentCsv) {
    try {
      const student = new UserEntity();
      student.email = studentCsv.email;
      student.verificationToken = this.getVerificationToken();
      student.role = UserRole.STUDENT;
      await student.save();
      student.studentInfo = await this.studentService.addStudentInfoFromCsvFile(
        studentCsv,
      );
      await student.save();
      return { isOk: true };
    } catch (err) {
      console.log(err);
      return { isOk: false, error: err.message };
    }
  }

  getVerificationToken() {
    return uuid();
  }
}
