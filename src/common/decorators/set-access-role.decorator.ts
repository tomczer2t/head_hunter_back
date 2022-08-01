import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../../types';

export const SetAccessRole = (accessRole: UserRole) =>
  SetMetadata('accessRole', accessRole);
