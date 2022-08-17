import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import {
  USER_INPUT_EMAIL_MAX_LENGTH,
  USER_INPUT_PASSWORD_MAX_LENGTH,
} from 'src/config/constants';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(USER_INPUT_EMAIL_MAX_LENGTH)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(USER_INPUT_PASSWORD_MAX_LENGTH)
  password: string;
}
