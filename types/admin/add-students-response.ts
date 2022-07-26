export interface FailedFor {
  email: string;
  error: string;
}

export interface AddStudentsResponse {
  failedFor: FailedFor[];
  failedCount: number;
  successCount: number;
  message: string;
}
