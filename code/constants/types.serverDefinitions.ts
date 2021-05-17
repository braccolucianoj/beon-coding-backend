import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';
import { FastifyRouteSchemaDef } from 'fastify/types/schema';
import { IFastifyContext } from '../plugins';

export interface ISignedData {
  token: string;
  expiresAt: number;
}

export interface ISignUserInformation {
  id: number;
  email: string;
}

export interface IAuthenticatedUserData extends ISignUserInformation {
  issuedAt: number;
  expiresAt: number;
}

export interface IExtendedFastifyRequest extends FastifyRequest {
  jsonWebToken: string;
  platformContext: IFastifyContext;
  user: IAuthenticatedUserData;
  sign: (value: ISignUserInformation) => ISignedData;
  body: any
}

export interface ICustomFastifyRequest<
  P extends RouteGenericInterface['Params'],
  Q extends RouteGenericInterface['Querystring']
> extends IExtendedFastifyRequest {
  params: P;
  query: Q;
}

export type CustomRouteHandler = (request: IExtendedFastifyRequest, response: FastifyReply) => Promise<void>;
export type CustomExtendedRouteHandler<ExtendedParams, ExtendedQuery> = (
  request: ICustomFastifyRequest<ExtendedParams, ExtendedQuery>,
  response: FastifyReply
) => Promise<void>;

const AVAILABLE_METHODS = ['post', 'put', 'get', 'patch', 'delete', 'options', 'head', 'all'] as const;
type IRouteMethod = typeof AVAILABLE_METHODS[number];

export interface ICustomRoute extends Partial<FastifyRouteSchemaDef<any>> {
  method: IRouteMethod;
  path: string;
  handler: CustomRouteHandler;
  needsAuthentication: boolean;
}

export interface IExtendedFastifyInstance extends FastifyInstance {
  authenticate: CustomRouteHandler;
}
