import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import {
  USER_INPUT_COMPANY_NAME_MAX_LENGTH,
  USER_INPUT_FIRSTNAME_MAX_LENGTH,
  USER_INPUT_FIRSTNAME_MIN_LENGTH,
  USER_INPUT_LASTNAME_MAX_LENGTH,
  USER_INPUT_LASTNAME_MIN_LENGTH,
} from '../../../config/constants';

export class HrFormRegistrationDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(USER_INPUT_FIRSTNAME_MIN_LENGTH)
  @MaxLength(USER_INPUT_FIRSTNAME_MAX_LENGTH)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(USER_INPUT_LASTNAME_MIN_LENGTH)
  @MaxLength(USER_INPUT_LASTNAME_MAX_LENGTH)
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(USER_INPUT_COMPANY_NAME_MAX_LENGTH)
  company: string;
}
