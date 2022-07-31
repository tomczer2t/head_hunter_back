import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { StudentStatus } from '../../../types';
import { METADATA_KEY_STUDENT_EMPLOYMENT_STATUS } from '../../config/global';

@Injectable()
export class StudentEmploymentStatusVerificationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireStatuses = this.reflector.get<StudentStatus[]>(
      METADATA_KEY_STUDENT_EMPLOYMENT_STATUS,
      context.getHandler(),
    );

    if (!requireStatuses) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user.studentInfo;

    if (!user) return false;

    return requireStatuses.some((status) => user.studentStatus == status);
  }
}
