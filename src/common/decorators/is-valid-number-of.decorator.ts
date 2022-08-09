import { ClassConstructor } from 'class-transformer';
import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  ValidatorConstraintInterface,
  ValidatorConstraint,
} from 'class-validator';
import { PhoneNumberUtil } from 'google-libphonenumber';
import * as iso from 'i18n-iso-countries';
// phone-number validator
export const IsValidNumberOf = <T>(
  type: ClassConstructor<T>,
  property: (o: T) => any,
  validationOptions?: ValidationOptions,
) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsValidNumberOfConstraint,
    });
  };
};

@ValidatorConstraint({ name: 'IsValidNumberOf', async: true })
export class IsValidNumberOfConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const util = PhoneNumberUtil.getInstance();

    const [fn] = args.constraints;
    // get the value of the country Field
    const countryCode = fn(args.object);
    // check if the country is valid even though it is checked at class level
    const isValidISOCode = iso.isValid(countryCode);
    if (!isValidISOCode) {
      return false;
    }

    // Checks if the value (number) belongs in the extracted countryCode
    const formattedPhoneNumber = util.parse(value, countryCode);
    const isValidPhoneNumber = util.isValidNumberForRegion(
      formattedPhoneNumber,
      countryCode,
    );
    if (!isValidPhoneNumber) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    // const [constraintProperty]: (() => any)[] = args.constraints;
    return `${args.property} must be a valid phone-number in the specified country`;
  }
}
