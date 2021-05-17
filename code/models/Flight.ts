import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { PersonFlight, PersonFlightId } from './PersonFlight';

export interface FlightAttributes {
  id?: number;
  updatedAt: Date;
  createdAt: Date;
  flightDate: Date;
  deleted: boolean;
  price: number;
  origin: string;
  destination: string;
  locationInfo: any;
}

export type FlightPk = 'id';
export type FlightId = Flight[FlightPk];
export type FlightCreationAttributes = Optional<FlightAttributes, FlightPk>;

export class Flight extends Model<FlightAttributes, FlightCreationAttributes> implements FlightAttributes {
  id?: number;
  createdAt!: Date;
  updatedAt!: Date;
  flightDate!: Date;
  deleted!: boolean;
  price!: number;
  origin!: string;
  destination!: string;

  get locationInfo() {
    return JSON.parse(this.getDataValue('locationInfo'));
  }

  set locationInfo(value) {
    console.log('here', JSON.stringify(value));
    this.setDataValue('locationInfo', JSON.stringify(value));
  }

  // Flight hasMany PersonFlight via flightId
  personFlights!: PersonFlight[];
  getPersonFlights!: Sequelize.HasManyGetAssociationsMixin<PersonFlight>;
  setPersonFlights!: Sequelize.HasManySetAssociationsMixin<PersonFlight, PersonFlightId>;
  addPersonFlight!: Sequelize.HasManyAddAssociationMixin<PersonFlight, PersonFlightId>;
  addPersonFlights!: Sequelize.HasManyAddAssociationsMixin<PersonFlight, PersonFlightId>;
  createPersonFlight!: Sequelize.HasManyCreateAssociationMixin<PersonFlight>;
  removePersonFlight!: Sequelize.HasManyRemoveAssociationMixin<PersonFlight, PersonFlightId>;
  removePersonFlights!: Sequelize.HasManyRemoveAssociationsMixin<PersonFlight, PersonFlightId>;
  hasPersonFlight!: Sequelize.HasManyHasAssociationMixin<PersonFlight, PersonFlightId>;
  hasPersonFlights!: Sequelize.HasManyHasAssociationsMixin<PersonFlight, PersonFlightId>;
  countPersonFlights!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof Flight {
    Flight.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'updated_at',
        },
        flightDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'flight_date',
        },
        deleted: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        price: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        origin: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        destination: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        locationInfo: {
          type: DataTypes.JSONB,
          allowNull: false,
          field: 'location_info',
        },
      },
      {
        sequelize,
        tableName: 'flight',
        schema: 'public',
        timestamps: true,
        defaultScope: {
          where: {
            deleted: false,
          },
        },
        indexes: [
          {
            name: 'flight_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
    return Flight;
  }
}
