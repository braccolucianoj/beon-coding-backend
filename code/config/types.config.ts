import { FastifyLoggerOptions } from 'fastify';
import { SignOptions } from 'jsonwebtoken';

export interface IDatabaseConfig {
  autoConnect: boolean;
  logging: boolean | any;
  dialect: string;
  host: string;
  port: number;
  pool: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
  username: string;
  password: string;
  database: string;
}

export interface IJWTSecretConfig {
  passphrase: string;
  privateKeyPath: string;
  publicKeyPath: string;
}

export interface IJWTConfig {
  expiresIn: number;
  sign: SignOptions;
  secret: IJWTSecretConfig;
}

export interface IServerConfig {
  address: string;
  appName: string;
  isHTTPS: boolean;
  port: number;
  hostname: string;
}

export interface ICORSConfig {
  addresses: string[];
  methods: string[];
}

export interface IPaginationConfig {
  defaultAmount: number;
  maxAmount: number;
}

export interface IConfig {
  production: boolean;
  database: IDatabaseConfig;
  jwt: IJWTConfig;
  server: IServerConfig;
  cors: ICORSConfig;
  logger: FastifyLoggerOptions | {};
  pagination: IPaginationConfig;
}
