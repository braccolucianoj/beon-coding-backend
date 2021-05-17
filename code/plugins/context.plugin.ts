import { Sequelize } from 'sequelize/types';
import fastifyPlugin from 'fastify-plugin';
import { FastifyInstance } from 'fastify';

import { AppUser, Flight, Person, PersonFlight } from '../models';

export interface IFastifyContext {
  models: {
    AppUser: typeof AppUser;
    Flight: typeof Flight;
    Person: typeof Person;
    PersonFlight: typeof PersonFlight;
  };
  databaseInstance: Sequelize;
}

const pluginFunction = (fastify: FastifyInstance, opts, next) => {
  const { context } = opts;
  fastify.decorateRequest('platformContext', context as IFastifyContext);
  next();
};

export const FASTIFY_CONTEXT_PLGUIN_NAME = 'fastify-context';

export const ContextPlugin = fastifyPlugin(pluginFunction, {
  fastify: '3.x',
  name: FASTIFY_CONTEXT_PLGUIN_NAME,
});
