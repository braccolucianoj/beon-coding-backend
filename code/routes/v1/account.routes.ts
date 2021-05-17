import * as configValues from 'config';
import { IConfig } from 'config/types.config';

import { AppUser, AppUserAttributes } from '../../models';
import { checkPassword, hashPassword, isValidPassword } from '../../services/password';
import { userSchema, loginSchema, changePasswordSchema } from './schemas/account.schemas';
import { CustomRouteHandler, ICustomRoute, MediaTypes } from '../../constants';

const config = configValues as IConfig;

export const signup: CustomRouteHandler = async (request, response) => {
  const { body } = request;
  const { password, ...userData } = body;
  const passwordValidation = isValidPassword(password);
  if (passwordValidation.valid) {
    const hashedPassword = await hashPassword(password);
    await AppUser.create({ ...userData, password: hashedPassword }, { validate: true }).then((res) => res.toJSON());
    return response.status(201).send();
  }
  return response.status(400).send(
    response.serialize({
      message: 'Password must comply with the expected rules',
      errors: passwordValidation.errors,
    })
  );
};

export const login: CustomRouteHandler = async (request, response) => {
  const { body } = request;
  const { AppUser } = request.platformContext.models;
  request.log.info(`${request.id} - `);
  const user = (await AppUser.findOne({
    where: {
      email: body.email,
    },
  }).then((res) => res.toJSON())) as AppUserAttributes;

  if (user) {
    const passwordsMatch = await checkPassword(user, body.password);
    if (passwordsMatch) {
      const token = await response.jwtSign({ id: user.id, email: user.email });
      return response
        .header(MediaTypes.AUTHORIZATION, `${MediaTypes.BEARER} ${token}`)
        .header(MediaTypes.EXPIRES_IN, config.jwt.sign.expiresIn)
        .status(204)
        .send();
    }
  }
  // A 401 could be used but that would mean the server to know the user
  // in order to give the resource which is not the case
};

export const changePassword: CustomRouteHandler = async (request, response) => {
  const { body, user, platformContext } = request;
  const { models } = platformContext;
  const { password } = body;
  const passwordValidation = isValidPassword(password);
  if (passwordValidation.valid) {
    const hashedPassword = await hashPassword(password);
    await models.AppUser.update({ password: hashedPassword }, { where: { id: user.id } });

    response.status(204).send();
  }
  return response.status(400).send(
    response.serialize({
      message: 'Password must comply with the expected rules',
      errors: passwordValidation.errors,
    })
  );
};

export default {
  signup: {
    method: 'post',
    path: '/signup',
    handler: signup,
    schema: {
      body: userSchema,
    },
    needsAuthentication: false,
  },
  login: {
    method: 'post',
    path: '/login',
    handler: login,
    schema: {
      body: loginSchema,
    },
    needsAuthentication: false,
  },
  changePassword: {
    method: 'patch',
    path: '/changePassword',
    handler: changePassword,
    needsAuthentication: true,
    schema: {
      body: changePasswordSchema,
    },
  },
} as Record<string, ICustomRoute>;
