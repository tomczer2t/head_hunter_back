import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  USER_INPUT_PASSWORD_MAX_LENGTH,
  USER_INPUT_PASSWORD_MIN_LENGTH,
} from '../../../config/global';
import { MatchDecorator } from '../../../common';

export class UserRegistrationDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(USER_INPUT_PASSWORD_MIN_LENGTH)
  @MaxLength(USER_INPUT_PASSWORD_MAX_LENGTH)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(USER_INPUT_PASSWORD_MIN_LENGTH)
  @MaxLength(USER_INPUT_PASSWORD_MAX_LENGTH)
  @MatchDecorator('password', { message: 'Provided passwords are different' })
  passwordConfirm: string;
}
