import * as unknownConfig from 'config';
import { Flight, FlightAttributes } from '../../models';
import { CustomRouteHandler, CustomExtendedRouteHandler, ICustomRoute, MediaTypes } from '../../constants';
import {
  flightSchema,
  flightParamSchema,
  flightUpdateSchema,
  flightPersonParamsSchema,
} from './schemas/flight.schemas';
import { IConfig } from 'config/types.config';
import { getWeather } from '../../services/weather';
import { personSchema } from './schemas/person.schemas';

const config = unknownConfig as IConfig;

interface IFlightParams {
  flightId: string;
}

interface IPassengerFlightParams extends IFlightParams {
  personId?: string;
}

interface IPaginatedResponse {
  page: number;
  amountItems: number;
  withDeleted: boolean;
}

export const createFlight: CustomRouteHandler = async (request, response) => {
  const { platformContext, body } = request;
  const { models } = platformContext;
  const [weatherOrigin, weatherDestination] = await Promise.all([
    getWeather(body.origin).catch(() => ({ data: 'No valid data' })),
    getWeather(body.destination).catch(() => ({ data: 'No valid data' })),
  ]);
  const flightObject = new models.Flight({ ...request.body, flightDate: new Date(request.body.flightDate) });
  flightObject.locationInfo = { origin: weatherOrigin, destination: weatherDestination };
  console.log(flightObject);
  const saved = await flightObject.save();
  return response
    .status(201)
    .header(MediaTypes.contentType, MediaTypes.json)
    .send(response.serialize({ id: saved.id }));
};
export const getFlights: CustomExtendedRouteHandler<IFlightParams, IPaginatedResponse> = async (request, response) => {
  const { models } = request.platformContext;
  const { withDeleted, page, amountItems = config.pagination.defaultAmount } = request.query;

  const paginationAmount = Math.min(amountItems, config.pagination.maxAmount);

  const LookupModel = withDeleted ? models.Flight.unscoped().scope('ordered') : models.Flight;
  const items = (await LookupModel.findAll({ limit: paginationAmount, offset: page * paginationAmount })).map((x) =>
    x.toJSON()
  );
  return response.status(200).header(MediaTypes.contentType, MediaTypes.json).send(response.serialize(items));
};

export const getFlight: CustomExtendedRouteHandler<IFlightParams, any> = async (request, response) => {
  const { models } = request.platformContext;
  const { flightId } = request.params;
  const flight = await models.Flight.unscoped().findByPk(flightId);
  console.log(flight.personFlights);
  response.status(200).header(MediaTypes.contentType, MediaTypes.json).send(response.serialize(flight));
};

export const deleteFlight: CustomExtendedRouteHandler<IFlightParams, void> = async (request, response) => {
  const { models } = request.platformContext;
  const { flightId } = request.params;
  await models.Flight.unscoped().update({ deleted: true }, { where: { id: flightId } });
  response.status(204).header(MediaTypes.contentType, MediaTypes.json).send();
};

export const udpateFlight: CustomExtendedRouteHandler<IFlightParams, void> = async (request, response) => {
  const { models } = request.platformContext;
  const { flightId } = request.params;
  const { price } = request.body as Partial<FlightAttributes>;
  await models.Flight.update({ price }, { where: { id: flightId } });
  response.status(204).header(MediaTypes.contentType, MediaTypes.json).send();
};

export const insertFlightPassenger: CustomExtendedRouteHandler<IPassengerFlightParams, void> = async (
  request,
  response
) => {
  const { models } = request.platformContext;
  const { flightId } = request.params;
  const person = await models.Person.create(request.body);
  await person.addPersonFlight(Number(flightId), { validate: true });
  response.status(204).header(MediaTypes.contentType, MediaTypes.json).send();
};

export const addFlightPassenger: CustomExtendedRouteHandler<IPassengerFlightParams, void> = async (
  request,
  response
) => {
  const { models } = request.platformContext;
  const { flightId, personId } = request.params;
  const flight = await models.Flight.findByPk(flightId);
  await flight.addPersonFlight(Number(personId), { validate: true });
  response.status(204).header(MediaTypes.contentType, MediaTypes.json).send();
};

export const deleteFlightPassenger: CustomExtendedRouteHandler<IPassengerFlightParams, void> = async (
  request,
  response
) => {
  const { models } = request.platformContext;
  const { flightId, personId } = request.params;
  const flight = await models.Flight.findByPk(flightId);
  await flight.removePersonFlight(Number(personId), { validate: true });
  response.status(204).header(MediaTypes.contentType, MediaTypes.json).send();
};

export default {
  createFlight: {
    method: 'post',
    path: '/flights',
    handler: createFlight,
    needsAuthentication: true,
    schema: {
      body: flightSchema,
    },
  },
  getFlights: {
    method: 'get',
    path: '/flights',
    handler: getFlights,
    needsAuthentication: true,
  },
  getFlight: {
    method: 'get',
    path: '/flight/:flightId',
    handler: getFlight,
    needsAuthentication: true,
    schema: {
      params: flightParamSchema,
    },
  },
  updateFlight: {
    method: 'patch',
    path: '/flights/:flightId',
    handler: udpateFlight,
    needsAuthentication: true,
    schema: {
      body: flightUpdateSchema,
      params: flightParamSchema,
    },
  },
  deleteFlight: {
    method: 'delete',
    path: '/flights/:flightId',
    handler: deleteFlight,
    needsAuthentication: true,
    schema: {
      params: flightParamSchema,
    },
  },
  addPassenger: {
    method: 'post',
    path: '/flight/:flightId/add',
    handler: insertFlightPassenger,
    needsAuthentication: true,
    schema: {
      params: flightParamSchema,
      body: personSchema,
    },
  },
  addPassengerExisting: {
    method: 'post',
    path: '/flight/:flightId/:personId',
    handler: addFlightPassenger,
    needsAuthentication: true,
    schema: {
      params: flightPersonParamsSchema,
    },
  },
  removePassenger: {
    method: 'delete',
    path: '/flight/:flightId/:personId',
    handler: deleteFlightPassenger,
    needsAuthentication: true,
    schema: {
      params: flightPersonParamsSchema,
    },
  },
} as Record<string, ICustomRoute>;
