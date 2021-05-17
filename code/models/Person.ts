import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { PersonFlight, PersonFlightId } from './PersonFlight';

export interface PersonAttributes {
  id?: number;
  firstName: string;
  lastName: string;
  identityNumber: number;
  birthDate: string;
  createdAt: Date;
}

export type PersonPk = 'id';
export type PersonId = Person[PersonPk];
export type PersonCreationAttributes = Optional<PersonAttributes, PersonPk>;

export class Person extends Model<PersonAttributes, PersonCreationAttributes> implements PersonAttributes {
  id?: number;
  firstName!: string;
  lastName!: string;
  identityNumber!: number;
  birthDate!: string;
  createdAt!: Date;

  // Person hasMany PersonFlight via personId
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

  static initModel(sequelize: Sequelize.Sequelize): typeof Person {
    Person.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        firstName: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'first_name',
        },
        lastName: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'last_name',
        },
        identityNumber: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'identity_number',
        },
        birthDate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          field: 'birth_date',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
        },
      },
      {
        sequelize,
        tableName: 'person',
        schema: 'public',
        timestamps: true,
        updatedAt: false,
        scopes: {
          withFlights: {
            include: ['personFlights'],
          },
        },
        indexes: [
          {
            name: 'person_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
    return Person;
  }
}
