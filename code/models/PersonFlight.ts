import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Flight, FlightId } from './Flight';
import type { Person, PersonId } from './Person';

export interface PersonFlightAttributes {
  id?: number;
  flightRole: string;
  personId: number;
  flightId: number;
}

export type PersonFlightPk = "id";
export type PersonFlightId = PersonFlight[PersonFlightPk];
export type PersonFlightCreationAttributes = Optional<PersonFlightAttributes, PersonFlightPk>;

export class PersonFlight extends Model<PersonFlightAttributes, PersonFlightCreationAttributes> implements PersonFlightAttributes {
  id?: number;
  flightRole!: string;
  personId!: number;
  flightId!: number;

  // PersonFlight belongsTo Flight via flightId
  flight!: Flight;
  getFlight!: Sequelize.BelongsToGetAssociationMixin<Flight>;
  setFlight!: Sequelize.BelongsToSetAssociationMixin<Flight, FlightId>;
  createFlight!: Sequelize.BelongsToCreateAssociationMixin<Flight>;
  // PersonFlight belongsTo Person via personId
  person!: Person;
  getPerson!: Sequelize.BelongsToGetAssociationMixin<Person>;
  setPerson!: Sequelize.BelongsToSetAssociationMixin<Person, PersonId>;
  createPerson!: Sequelize.BelongsToCreateAssociationMixin<Person>;

  static initModel(sequelize: Sequelize.Sequelize): typeof PersonFlight {
    PersonFlight.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    flightRole: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'flight_role'
    },
    personId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'person',
        key: 'id'
      },
      field: 'person_id'
    },
    flightId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'flight',
        key: 'id'
      },
      field: 'flight_id'
    }
  }, {
    sequelize,
    tableName: 'person_flight',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "person_flight_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return PersonFlight;
  }
}
