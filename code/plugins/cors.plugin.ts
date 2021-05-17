import * as config from 'config';
import { MediaTypes } from '../constants';
import plugin, { FastifyCorsOptions } from 'fastify-cors';

import { IConfig } from '../config/types.config';

const { cors } = config as IConfig;

export const CORSPlugin = {
  plugin,
  config: {
    credentials: true,
    allowedHeaders: [MediaTypes.CONTENT_TYPE, MediaTypes.ACCEPT_TYPE],
    methods: cors.methods,
    origin: cors.addresses,
  } as FastifyCorsOptions,
};
