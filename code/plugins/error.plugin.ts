import fastifyPlugin from 'fastify-plugin';
import { FastifyRequest, FastifyReply } from 'fastify';

const errorHandlingFunction = (error, request: FastifyRequest, reply: FastifyReply) => {
  let body;
  let status;
  request.log.child({ requestId: request.id });
  // request.log.error('ERROR', JSON.stringify(error));
  console.log(error);
  if (error.validation) {
    status = 400;
    body = error.validation;
  } else if (error instanceof TypeError) {
    status = 400;
    body = { name: error.name, message: error.message };
  } else {
    status = 500;
    body = {
      name: 'Unexpected Error',
      message: 'An unexpected error seems to have occurred',
    };
  }
  request.log.error(`Error received, returning status ${status} with `, body);
  reply.status(status).send(reply.serialize(body));
};

const pluginFunction = (fastify, opts, next) => {
  fastify.setErrorHandler(errorHandlingFunction);
  next();
};

export const FASTIFY_ERROR_PLGUIN_NAME = 'fastify-errors';

export const ErrorPlugin = fastifyPlugin(pluginFunction, {
  fastify: '3.x',
  name: 'fastify-errors',
});
