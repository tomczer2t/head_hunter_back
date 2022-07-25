import { Injectable } from '@nestjs/common';
import { StudentCsv } from '../../../types';
import { UserService } from '../user/user.service';

@Injectable()
export class AdminService {
  constructor(private userService: UserService) {}

  async addStudents(students: StudentCsv[]) {
    let lastError: string;
    const failedFor: string[] = [];
    for (const student of students) {
      const result = await this.userService.addStudentFromCsvFile(student);
      if (!result.isOk) {
        failedFor.push(student.email);
        lastError = result.error;
      }
    }

    return {
      failed: failedFor,
      successNo: students.length - failedFor.length,
      lastError,
    };
  }
}
