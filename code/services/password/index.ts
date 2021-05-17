import * as bcrypt from 'bcrypt';
import * as owasp from 'owasp-password-strength-test';

import { AppUserAttributes } from 'models';
import { boolean } from 'yup/lib/locale';

owasp.config({
  allowPassphrases: false,
  minLength: 8,
});

const SALT_ROUNDS = 10;

interface IValidPassword {
  valid: boolean;
  errors?: any;
}

export const isValidPassword = (password): IValidPassword => {
  const testResult = owasp.test(password);
  return testResult.strong ? { valid: true } : { valid: false, errors: testResult.requiredTestErrors };
};

export const hashPassword = async (password): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

export const checkPassword = async (user: AppUserAttributes, givenPassword: string) =>
  bcrypt.compare(givenPassword, user.password);
