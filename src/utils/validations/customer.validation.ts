// src/validations/customerValidation.ts
import { z } from 'zod';

export const EditCustomerSchema = z.object({
  id: z.number().optional(),
  user_id: z.number().optional(),
  first_name: z.string().min(1, 'Firsts name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  job_title: z.string().optional(),
  address: z.string().optional(),
  password: z.string().optional(),
  company_id: z.string().min(1, 'Company is required'),
});

