const { database, jwt } = require('./secrets/default');

module.exports = {
  production: false,
  database: {
    autoConnect: true,
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    ...database,
  },
  jwt: {
    sign: {
      algorithm: 'RS256',
      expiresIn: 3600 * 1000 * 1000,
    },
    ...jwt,
  },
  server: {
    address: 'localhost',
    appName: '',
    isHTTPS: false,
    port: 4000,
    hostname: '0.0.0.0',
  },
  cors: {
    addresses: ['http://localhost:3000', '*'],
    methods: ['PUT', 'POST', 'GET', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  },
  logger: {
    prettyPrint: true,
  },
  pagination: {
    defaultAmount: 10,
    maxAmount: 100,
  },
};
