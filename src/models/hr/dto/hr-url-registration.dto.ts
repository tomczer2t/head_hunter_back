import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { MatchDecorator } from '../../../common';
import {
  USER_INPUT_PASSWORD_MAX_LENGTH,
  USER_INPUT_PASSWORD_MIN_LENGTH,
} from '../../../config/global';

export class HrUrlRegistrationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(USER_INPUT_PASSWORD_MIN_LENGTH)
  @MaxLength(USER_INPUT_PASSWORD_MAX_LENGTH) //  min and max password length supported by https://www.auditboard.com/blog/nist-password-guidelines/
  password: string;

  @IsString()
  @MinLength(USER_INPUT_PASSWORD_MIN_LENGTH)
  @MaxLength(USER_INPUT_PASSWORD_MAX_LENGTH)
  @MatchDecorator('password', { message: 'Provided passwords are different' })
  passwordConfirm: string;
}
