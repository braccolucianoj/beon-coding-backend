import * as config from 'config';
import { Sequelize } from 'sequelize';

import { IDatabaseConfig } from 'config/types.config';

interface IDatabaseConnection extends IDatabaseConfig {
  logging: boolean | ((sql: string, timing?: number) => void);
}

const sequelizeConnection = (({ database, username, password, ...rest }: IDatabaseConnection) =>
  new Sequelize(database, username, password, {
    ...rest,
    dialect: 'postgres',
    native: false,
  }))(config.database);

sequelizeConnection
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.log('Unable to connect to the PostgreSQL database:', err);
  });

export default sequelizeConnection;
