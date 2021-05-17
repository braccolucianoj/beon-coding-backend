import { CustomRouteHandler, IExtendedFastifyInstance } from '../constants';
import FlightRoutes from './v1/flight.routes';
import AccountRoutes from './v1/account.routes';
import PersonRoutes from './v1/person.routes';
import { validatorCompiler } from './v1/schemas/general.schemas';

const version1Routes = [FlightRoutes, AccountRoutes, PersonRoutes]
  .map((routeObject) => Object.values(routeObject))
  .reduce((total, objectRoute) => total.concat(objectRoute), []);

const registerRoutes = (fastify: IExtendedFastifyInstance, routes, hooks = {}) => {
  const opts = { hooks, routes };
  const routesToRegister = function register(instance, options, next) {
    Object.keys(options.hooks).forEach((hookName) => {
      options.hooks[hookName].map((hookFunc) => instance.addHook(hookName, hookFunc.bind(instance)));
    });
    options.routes.map((route) =>
      instance[route.method](
        route.path,
        {
          schema: route.schema,
          validatorCompiler,
        },
        route.handler
      )
    );
    next();
  };
  fastify.register(routesToRegister, { ...opts, prefix: '/v1' });
};

const exportModelRoutes = (fastify: IExtendedFastifyInstance, routes) => {
  const authRoutes = routes.filter((x) => x.needsAuthentication);
  const nonAuthRoutes = routes.filter((x) => !x.needsAuthentication);
  registerRoutes(fastify, authRoutes, {
    // preHandler: [
    preValidation: [
      async (request, reply) => {
        try {
          await request.jwtVerify();
        } catch (err) {
          reply.status(401).send();
        }
      },
    ],
  });
  registerRoutes(fastify, nonAuthRoutes, {});
};

export default (fastifyInstance: IExtendedFastifyInstance) => exportModelRoutes(fastifyInstance, version1Routes);
