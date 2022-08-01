export interface FailedFor {
  email: string;
  error: string;
}

export interface AddStudentsResponse {
  failedFor: FailedFor[];
  updatedFor: string[];
  failedCount: number;
  successCount: number;
  message: string;
}

export enum ErrorType {
  FILE_ERROR,
  VALIDATION_PARSED_FILE,
}

interface BasicError {
  massage: string;
}

interface FileError extends BasicError {
  errorType: ErrorType.FILE_ERROR;
}

interface ValidationError extends BasicError {
  errorType: ErrorType.VALIDATION_PARSED_FILE;
  row: number;
}

export type AddStudentsError = FileError | ValidationError;
