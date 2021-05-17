import { CustomExtendedRouteHandler, CustomRouteHandler, ICustomRoute, MediaTypes } from '../../constants';
import { getPersonSchema, personSchema } from './schemas/person.schemas';
interface IPersonParams {
  personId: string;
}

export const createPerson: CustomRouteHandler = async (request, response) => {
  const { platformContext, body } = request;
  const { models } = platformContext;
  const personObject = new models.Person(request.body);
  const saved = await personObject.save();
  return response
    .status(201)
    .header(MediaTypes.contentType, MediaTypes.json)
    .send(response.serialize({ id: saved.id }));
};

export const getPerson: CustomExtendedRouteHandler<IPersonParams, any> = async (request, response) => {
  const { models } = request.platformContext;
  const { personId } = request.params;
  const person = await models.Person.unscoped().scope(['withFlights']).findByPk(Number(personId));
  return response.status(200).header(MediaTypes.contentType, MediaTypes.json).send(response.serialize(person));
};

export default {
  createPerson: {
    method: 'post',
    path: '/person',
    handler: createPerson,
    needsAuthentication: true,
    schema: {
      body: personSchema,
    },
  },
  getPerson: {
    method: 'get',
    path: '/person/:personId',
    handler: getPerson,
    needsAuthentication: true,
    schema: {
      params: getPersonSchema,
    },
  },
} as Record<string, ICustomRoute>;
