import { Injectable } from '@nestjs/common';
import { StudentCsv } from '../../../types';
import { StudentInfoEntity } from './entities';
import { StudentFormProfileDto } from './dto/student-form-profile.dto';

@Injectable()
export class StudentService {
  async addStudentInfoFromCsvFile({
    email,
    ...restStudentData
  }: StudentCsv): Promise<StudentInfoEntity> {
    const studentInfo = new StudentInfoEntity();
    for (const [key, value] of Object.entries(restStudentData)) {
      studentInfo[key] = value;
    }
    await studentInfo.save();
    return studentInfo;
  }
}
export class StudentService {
  urlRegistration(studentFormProfileDto: StudentFormProfileDto) {
    console.log('studentUrlRegistrationDto', studentFormProfileDto);
  }
}
