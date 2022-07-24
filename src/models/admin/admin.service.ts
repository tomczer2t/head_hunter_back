import { Injectable } from '@nestjs/common';
import { StudentCsv } from '../../../types';

@Injectable()
export class AdminService {
  async addStudents(students: StudentCsv[]) {
    return students;
  }
}
