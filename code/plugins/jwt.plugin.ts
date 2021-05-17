import * as _ from 'lodash';
import * as config from 'config';
import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import FastifyJWTPlugin from 'fastify-jwt';

import { IConfig } from '../config/types.config';
import { loadSecrets } from '../utils';

const pluginFunction = (fastify: FastifyInstance, {}, next: () => void) => {
  const { jwt } = config as IConfig;
  fastify.register(FastifyJWTPlugin, {
    sign: jwt.sign,
    secret: loadSecrets(jwt as any),
  });

  next();
};

export const AUTHENTICATION_PLUGIN_NAME = 'fastify-authentication';

export const JWTPlugin = fastifyPlugin(pluginFunction, {
  fastify: '3.x',
  name: AUTHENTICATION_PLUGIN_NAME,
});
