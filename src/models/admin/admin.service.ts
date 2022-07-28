import { Injectable } from '@nestjs/common';
import { AddStudentsResponse, FailedFor, StudentCsv } from '../../../types';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities';
import { EmailProviderService } from '../../providers/email/provider.service';
import { studentRegistrationTemplate } from '../../providers/email/templates';
import { AppConfigService } from '../../config/app/config.service';
import { StudentService } from '../student/student.service';

@Injectable()
export class AdminService {
  constructor(
    private studentService: StudentService,
    private userService: UserService,
    private emailProviderService: EmailProviderService,
    private appConfigService: AppConfigService,
  ) {}

  async addStudents(students: StudentCsv[]): Promise<AddStudentsResponse> {
    const failedFor: FailedFor[] = [];

    for (const student of students) {
      try {
        const newStudent = await this.studentService.addStudent(student);
        await this.sendStudentRegistrationMail(newStudent);
      } catch (err) {
        failedFor.push({ email: student.email, error: err.message });
        await this.userService.findAndDelete(student.email);
      }
    }

    const failedCount = failedFor.length;
    const successCount = students.length - failedCount;
    return {
      failedFor,
      failedCount,
      message: `Successfully imported and registered ${successCount} students out of a possible ${students.length}.`,
      successCount,
    };
  }

  async sendStudentRegistrationMail(student: UserEntity) {
    const origin = this.appConfigService.origin;
    const subject = 'Finish your registration process on MegaK Head Hunter.';

    const emailBody = studentRegistrationTemplate(
      student.id,
      student.verificationToken,
      origin,
    );
    return await this.emailProviderService.sendMail(
      student.email,
      subject,
      emailBody,
    );
  }
}
