// utils/joi-validation.ts
import { ValidationError } from 'joi';

export const joiToFormikErrors = (error: ValidationError) => {
  const errors: Record<string, string> = {};
  error.details.forEach((detail) => {
    const key = detail.path[0] as string;
    errors[key] = detail.message;
  });
  return errors;
};