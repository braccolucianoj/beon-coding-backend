const { database, jwt } = require('./secrets/production');

module.exports = {
  production: true,
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
  jwt,
};
