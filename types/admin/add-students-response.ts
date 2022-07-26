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

enum ErrorType {
  INVALID_EXTENSION_FILE,
  VALIDATION_PARSED_FILE,
}

interface BasicError {
  massage: string;
  statusCode: number;
}

interface ExtensionError extends BasicError {
  errorType: ErrorType.INVALID_EXTENSION_FILE;
}

interface ValidationError extends BasicError {
  errorType: ErrorType.VALIDATION_PARSED_FILE;
  row: number;
}

export type AddStudentsError = ExtensionError | ValidationError;
