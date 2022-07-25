import { Injectable } from '@nestjs/common';
import { StudentCsv } from '../../../types';
import { UserEntity } from './entities';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
  async addStudentFromCsvFile(studentCsv: StudentCsv) {
    const student = new UserEntity();
    student.email = studentCsv.email;
    student.verificationToken = this.getVerificationToken();
    await student.save();
  }

  getVerificationToken() {
    return uuid();
  }
}
