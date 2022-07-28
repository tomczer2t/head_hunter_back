import { Injectable } from '@nestjs/common';
import { StudentService } from '../student/student.service';
import { genSalt, hash } from 'bcrypt';
import { UserAccountStatus, UserRole } from '../../../types';
import { UserEntity } from '../user/entities';
import { HrInfoEntity } from '../hr/entities';

@Injectable()
export class TestService {
  constructor(private studentService: StudentService) {}
  async createTestsAccounts() {
    const student = await this.studentService.addStudent({
      email: 'student@test.com',
      bonusProjectUrls: [
        'https://github.com/example/example-repo',
        'https://github.com/example/example-repo-2',
      ],
      courseEngagment: 4,
      teamProjectDegree: 4,
      projectDegree: 4,
      courseCompletion: 2,
    });

    const password = 'Haslo1234';

    student.passwordHash = await hash(password, await genSalt(10));
    student.accountStatus = UserAccountStatus.ACTIVE;
    await student.save();

    const admin = new UserEntity();
    admin.email = 'admin@test.com';
    admin.passwordHash = await hash(password, await genSalt(10));
    admin.accountStatus = UserAccountStatus.ACTIVE;
    admin.role = UserRole.ADMIN;
    await admin.save();

    const hr = new UserEntity();
    hr.email = 'hr@test.com';
    hr.passwordHash = await hash(password, await genSalt(10));
    hr.accountStatus = UserAccountStatus.ACTIVE;
    hr.role = UserRole.HR;
    const hrInfo = new HrInfoEntity();
    hrInfo.company = 'test company';
    hrInfo.firstName = 'Tester';
    hrInfo.lastName = 'Testowy';
    hrInfo.maxReservedStudents = 100;
    await hrInfo.save();
    hr.hrInfo = hrInfo;
    await hr.save();

    return { student, admin, hr };
  }
}
