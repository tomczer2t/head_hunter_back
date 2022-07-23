import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MatchDecorator } from '../../../common';

export class HrUrlRegistrationDto {

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(64) //  min and max password length supported by https://www.auditboard.com/blog/nist-password-guidelines/
  password: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @MatchDecorator('password', { message: 'Provided passwords are different' })
  passwordConfirm: string;
}
