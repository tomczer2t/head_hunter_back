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

  async addStudents(studentsCsv: StudentCsv[]): Promise<AddStudentsResponse> {
    const failedFor: FailedFor[] = [];
    const updatedFor: string[] = [];

    for (const studentCsv of studentsCsv) {
      try {
        const { student, isUpdated } =
          await this.studentService.addStudentOrUpdate(studentCsv);
        if (!isUpdated) {
          await this.sendStudentRegistrationMail(student);
        } else {
          updatedFor.push(student.email);
        }
      } catch (err) {
        failedFor.push({ email: studentCsv.email, error: err.message });
        await this.userService.findAndDelete(studentCsv.email);
      }
    }

    const failedCount = failedFor.length;
    const successfullyUpdated = updatedFor.length;
    const successfullyAdded =
      studentsCsv.length - failedCount - successfullyUpdated;
    return {
      failedFor,
      updatedFor,
      failedCount,
      message: `Successfully imported and registered ${
        successfullyAdded + successfullyUpdated
      } students out of a possible ${studentsCsv.length}.`,
      successfullyUpdated,
      successfullyAdded,
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
