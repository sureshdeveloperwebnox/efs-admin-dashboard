import Joi, { CustomHelpers } from 'joi';
import { isValidPhoneNumber } from 'libphonenumber-js';

export const validatePhoneNumber = (fieldName: string) => {
  return Joi.object({
    [fieldName]: Joi.string()
      .required()
      .custom((value: string, helpers: CustomHelpers) => {
        if (!isValidPhoneNumber(value)) {
          return helpers.error('any.invalid');
        }
        return value;
      }, 'Phone number validation')
      .label(fieldName), // This is where the label is added
  });
};
