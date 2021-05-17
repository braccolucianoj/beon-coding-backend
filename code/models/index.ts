import type { Sequelize, Model } from 'sequelize';
import { AppUser } from './AppUser';
import type { AppUserAttributes, AppUserCreationAttributes } from './AppUser';
import { Flight } from './Flight';
import type { FlightAttributes, FlightCreationAttributes } from './Flight';
import { Person } from './Person';
import type { PersonAttributes, PersonCreationAttributes } from './Person';
import { PersonFlight } from './PersonFlight';
import type { PersonFlightAttributes, PersonFlightCreationAttributes } from './PersonFlight';

export { AppUser, Flight, Person, PersonFlight };

export type {
  AppUserAttributes,
  AppUserCreationAttributes,
  FlightAttributes,
  FlightCreationAttributes,
  PersonAttributes,
  PersonCreationAttributes,
  PersonFlightAttributes,
  PersonFlightCreationAttributes,
};

export default (sequelize: Sequelize) => {
  AppUser.initModel(sequelize);
  Flight.initModel(sequelize);
  Person.initModel(sequelize);
  PersonFlight.initModel(sequelize);

  PersonFlight.belongsTo(Flight, { as: 'flight', foreignKey: 'flightId' });
  Flight.hasMany(PersonFlight, { as: 'personFlights', foreignKey: 'flightId' });
  PersonFlight.belongsTo(Person, { as: 'person', foreignKey: 'personId' });
  Person.hasMany(PersonFlight, { as: 'personFlights', foreignKey: 'personId' });

  return {
    AppUser: AppUser,
    Flight: Flight,
    Person: Person,
    PersonFlight: PersonFlight,
  };
};
