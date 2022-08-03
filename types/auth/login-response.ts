import { UserAccountStatus, UserRole } from '../user';

export interface LoginResponse {
  role: UserRole;
  accessToken: string;
  firstName?: string;
  lastName?: string;
  githubUsername?: string | null;
  accountStatus: UserAccountStatus;
}
