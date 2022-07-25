import {
  BadRequestException,
  ConflictException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { StudentCsv } from '../../../types';
import { UserEntity } from '../../models/user/entities';

@Injectable()
export class StudentsCsvValidatorPipe implements PipeTransform {
  async transform(students: StudentCsv[]) {
    await this.validateStudents(students);
    return students;
  }

  async validateStudents(students: StudentCsv[]) {
    for (const [index, student] of students.entries()) {
      const row = index + 2;
      const { email, bonusProjectUrls, ...degrees } = student;

      this.validateEmptyFields(student, row);
      this.validateHeaders(Object.keys(student));
      await this.validateEmail(email, row);
      this.validateDegrees(degrees, row);
      this.validateGithubUrls(bonusProjectUrls, row);
    }
  }

  validateEmptyFields(student: StudentCsv, row: number) {
    const isAnyNull = Object.values(student).some((value) => !value);
    if (isAnyNull) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'All fields are required',
        row,
      });
    }
  }

  async validateEmail(email: string, row: number) {
    console.log({ email });
    if (!email.includes('@')) {
      throw new BadRequestException({
        statusCode: 400,
        message: `Email is not valid - ${email}`,
        row,
      });
    }
    const emailExists = !!(await UserEntity.findOneBy({ email }));
    if (emailExists) {
      throw new ConflictException({
        statusCode: 409,
        message: `Email already exists in database - ${email}`,
        row,
      });
    }
  }

  validateDegrees(
    degrees: Omit<StudentCsv, 'email' | 'bonusProjectUrls'>,
    row: number,
  ) {
    Object.values(degrees).forEach((degree) => {
      if (typeof degree !== 'number') {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Each degree must be a number',
          row,
        });
      }
      if (degree < 0 || degree > 5) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Each degree must be in the range of 0-5',
          row,
        });
      }
    });
  }

  validateGithubUrls(urls: string[], row: number) {
    const isEveryValid = urls.some((urlString) => {
      if (!urlString.includes('github')) {
        return false;
      }
      try {
        const url = new URL(urlString);
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch (_) {
        return false;
      }
    });
    if (!isEveryValid) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Each bonus project URL should be proper github url',
        row,
      });
    }
  }

  validateHeaders(headers) {
    const requiredHeaders = [
      'email',
      'courseCompletion',
      'courseEngagment',
      'projectDegree',
      'bonusProjectUrls',
      'teamProjectDegree',
    ];

    const isThereAllRequiredHeaders = requiredHeaders.some(
      (requiredHeader) => !headers.includes(requiredHeader),
    );

    if (isThereAllRequiredHeaders) {
      throw new BadRequestException({
        statusCode: 400,
        message: `Headers: ${requiredHeaders.join(', ')} are required.`,
        row: 0,
      });
    }

    const isThereUnnecessaryHeaders = headers.some((header) => {
      return !requiredHeaders.includes(header);
    });

    if (isThereUnnecessaryHeaders) {
      throw new BadRequestException({
        statusCode: 400,
        message: `Only ${requiredHeaders.join(', ')} headers are accepted.`,
        row: 0,
      });
    }
  }
}
