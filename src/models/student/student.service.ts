import { Injectable } from '@nestjs/common';
import { StudentCsv, UserRole } from '../../../types';
import { StudentInfoEntity } from './entities';
import { StudentFormProfileDto } from './dto/student-form-profile.dto';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities';
import { GetUser } from '../../common';

@Injectable()
export class StudentService {
  constructor(private userService: UserService) {}

  async updateStudentInfo(
    studentFormProfileDto: StudentFormProfileDto,
    user: UserEntity,
  ) {
    const { studentInfo } = await UserEntity.findOne({
      where: { id: 'user4-student4-update' },
    });
    if (!studentInfo) {
      console.log('user does not exist');
    } else {
      console.log('updateStudentInfo', user);
    }
  }

  async addStudent(studentCsvData: StudentCsv) {
    const { email, ...restStudentData } = studentCsvData;
    const student = await this.userService.addUser(email, UserRole.STUDENT);
    student.studentInfo = await this.addStudentInfo(restStudentData);
    await student.save();
    return student;
  }

  async addStudentInfo(
    studentInfoCsvData: Omit<StudentCsv, 'email'>,
  ): Promise<StudentInfoEntity> {
    const studentInfo = new StudentInfoEntity();
    for (const [key, value] of Object.entries(studentInfoCsvData)) {
      if (key === 'bonusProjectUrls') {
        studentInfo[key] = JSON.stringify(value);
      } else {
        studentInfo[key] = value;
      }
    }
    await studentInfo.save();
    return studentInfo;
  }
}
