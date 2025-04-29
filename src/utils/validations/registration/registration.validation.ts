// registerValidation.ts
import Joi from 'joi';

export const registerValidationSchema = {
  name: Joi.string().max(255).required().label('First Name'),
  lastname: Joi.string().max(255).required().label('Last Name'),
  email: Joi.string().email({ tlds: { allow: false } }).max(255).required().label('Email Address'),
  password: Joi.string().required().max(10).trim().label('Password'),
  organization: Joi.string().allow('').required().label('Organization'),
  phone: Joi.string().allow('').required().label('Phone Number'),
  pincode: Joi.string().allow('').required().label('PIN Code'),
  website: Joi.string().allow('').required().label('Website'),
  address: Joi.string().allow('').required().label('Address')
};

export const RegisterValidation = Joi.object(registerValidationSchema);