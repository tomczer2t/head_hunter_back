import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { StudentStatus } from '../../../types';

@Injectable()
export class StudentEmploymentVerificationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireStatuses = this.reflector.get<StudentStatus[]>(
      'studentStatusesWhichAreAllowedToStillHaveAccessToThisApplication',
      context.getHandler(),
    );

    if (!requireStatuses) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user.studentInfo;

    if (!user) return false;

    return requireStatuses.some((status) => user.studentStatus == status);
  }
}
