import { UserAccountStatus } from '../user';

export interface LoginResponse {
  role: string;
  accessToken: string;
  firstName?: string;
  lastName?: string;
  githubUsername?: string | null;
  accountStatus: UserAccountStatus;
}
