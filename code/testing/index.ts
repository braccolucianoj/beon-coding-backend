import * as Config from 'config';
import { IConfig } from '../config/types.config';
import { sign } from 'jsonwebtoken';
import { loadPrivateKey } from '../utils';

const config = Config as IConfig;

export const TESTING_URL = `http://${config.server.address}:${config.server.port}`;

export const DEFAULT_DATA = {
  email: 'testing@test.com',
  id: 1,
};

export const createToken = (data: any = DEFAULT_DATA) =>
  sign(data, loadPrivateKey(config.jwt as any), { expiresIn: '1h', algorithm: 'RS256' });
