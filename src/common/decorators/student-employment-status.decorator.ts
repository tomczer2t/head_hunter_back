import { SetMetadata } from '@nestjs/common';
import { StudentStatus } from '../../../types';

export const StudentEmploymentStatus = (...studentStatuses: StudentStatus[]) =>
  SetMetadata(
    'studentStatusesWhichAreAllowedToStillHaveAccessToThisApplication',
    studentStatuses,
  );
