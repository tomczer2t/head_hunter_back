export interface LoginResponse {
  userRole: string;
  accessToken: string;
  firstName: string;
  lastName: string;
  githubUsername: string | null;
}
