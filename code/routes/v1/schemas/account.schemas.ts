import * as yup from 'yup';

import { requiredPropertyMsg } from './general.schemas';
import { personSchema } from './person.schemas';

export const userSchema = yup.object({
  email: yup.string().email().required(requiredPropertyMsg('email')),
  firstName: yup.string().required(requiredPropertyMsg('firstName')),
  lastName: yup.string().max(255).required(requiredPropertyMsg('firstName')),
  // regex validation missing
  phone: yup.string().max(20).required(requiredPropertyMsg('phone')),
  password: yup.string().required(requiredPropertyMsg('password')),
});

export const loginSchema = yup.object({
  email: yup.string().email().required(requiredPropertyMsg('email')),
  password: yup.string().required(requiredPropertyMsg('password')),
});

export const changePasswordSchema = yup.object({
  password: yup.string().required(requiredPropertyMsg('password')),
});
