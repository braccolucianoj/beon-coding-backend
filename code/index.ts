import * as config from 'config';
import Fastify, { FastifyInstance, FastifyLoggerOptions } from 'fastify';

import initModels from './models';
import { IConfig } from './config/types.config';
import SequelizeInstance from './services/database';
import RegisterRoutes from './routes';
import { ContextPlugin, IFastifyContext, ErrorPlugin, CORSPlugin, JWTPlugin } from './plugins';

export const build = () => {
  const {
    server: { port, hostname },
    production,
  } = config as IConfig;
  const app: FastifyInstance = Fastify({
    ajv: {
      customOptions: {
        jsonPointers: true,
        removeAdditional: true,
        useDefaults: true,
        coerceTypes: true,
        allErrors: true,
        nullable: true,
      },
    },
    logger: {
      level: 'info',
      file: production ? 'logs/combined.log' : undefined,
      redact: ['req.headers.cookies', 'req.headers.authorization'],
      prettyPrint: true,
      ...(config as IConfig).logger,
    } as FastifyLoggerOptions,
    bodyLimit: 1024 * 1024, // 1Mb
  });
  // Fastify Context
  const context: IFastifyContext = {
    databaseInstance: SequelizeInstance,
    models: initModels(SequelizeInstance),
  };
  // Setting plugins
  app.register(ErrorPlugin);
  app.register(ContextPlugin, { context });
  app.register(JWTPlugin);
  app.register(CORSPlugin.plugin, CORSPlugin.config);
  // Routes
  RegisterRoutes(app as any);
  // Finale
  return app;
};

export const main = (callback?: any) => {
  const {
    server: { port, hostname },
  } = config as IConfig;
  const app = build();
  app.listen(port, hostname, (err, address) => {
    if (callback) callback();
    if (err) {
      console.log('ERROR', err);
    } else {
      console.log(`Listening on address ${address}`);
    }
  });
};

main();
