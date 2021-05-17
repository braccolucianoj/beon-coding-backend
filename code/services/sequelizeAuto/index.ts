import SequelizeAuto from 'sequelize-auto';
import * as config from 'config';

const { database } = config;
const { database: databaseName, username, password, ...rest } = database;

const auto = new SequelizeAuto(databaseName, username, password, {
  ...rest,
  directory: './services/sequelizeAuto/out/',
  caseModel: 'p',
  caseFile: 'p',
  caseProp: 'c',
  singularize: true,
  additional: {
    timestamps: true,
  },
  lang: 'ts',
  views: true,
});

auto.run().then((data) => {});
