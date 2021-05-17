import * as yup from 'yup';

import { requiredPropertyMsg } from './general.schemas';

export const personSchema = yup.object({
  firstName: yup.string().required(requiredPropertyMsg('firstName')),
  lastName: yup.string().max(255).required(requiredPropertyMsg('firstName')),
  identityNumber: yup.number().required(requiredPropertyMsg('identityNumber')),
  // Age
  birthDate: yup.date().required(requiredPropertyMsg('firstName')),
});

export const getPersonSchema = yup.object({
  personId: yup.string().required(requiredPropertyMsg('personId')),
});
