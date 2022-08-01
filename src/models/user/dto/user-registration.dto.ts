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
} from '../../../config/constants';
import { MatchDecorator } from '../../../common/decorators';

export class UserRegistrationDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  authorizationToken: string;

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
