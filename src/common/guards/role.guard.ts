import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { UserEntity } from '../../models/user/entities';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user as UserEntity;
    const accessRoles = this.reflector.getAllAndOverride<string[]>(
      'accessRole',
      [context.getHandler(), context.getClass()],
    );
    if (!user || accessRoles.length === 0) return true;
    return accessRoles.includes(user.role);
  }
}
