import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { USER_INPUT_GITHUB_USERNAME_MAX_LENGTH } from '../../../config/constants';

export class AddStudentToInterviewDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(USER_INPUT_GITHUB_USERNAME_MAX_LENGTH)
  githubUsername: string;
}
