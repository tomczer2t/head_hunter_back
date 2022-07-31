import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { StudentStatus } from '../../../types';

@Injectable()
export class StudentEmploymentVerificationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requireStatuses = this.reflector.getAllAndOverride<StudentStatus[]>(
      'studentStatusesWhichAreAllowedToStillHaveAccessToThisApplication',
      [context.getHandler(), context.getClass()],
    );

    console.log('context.getHandler()', context.getHandler());
    console.log('context.getClass()', context.getClass());
    console.log('requireStatuses', requireStatuses);

    if (!requireStatuses) {
      return true;
    }
    // const user = new StudentInfoEntity();
    // user.studentStatus = StudentStatus.HIRED;
    const request = context.switchToHttp().getRequest();
    console.log(request);
    const user = request.user;
    return requireStatuses.some((status) => user.studentStatus == status);
  }
}
