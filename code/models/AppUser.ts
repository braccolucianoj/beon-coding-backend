import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface AppUserAttributes {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AppUserPk = "id";
export type AppUserId = AppUser[AppUserPk];
export type AppUserCreationAttributes = Optional<AppUserAttributes, AppUserPk>;

export class AppUser extends Model<AppUserAttributes, AppUserCreationAttributes> implements AppUserAttributes {
  id?: number;
  email!: string;
  firstName!: string;
  lastName!: string;
  phone!: string;
  password!: string;
  createdAt!: Date;
  updatedAt!: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof AppUser {
    AppUser.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "app_user_email_key"
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'last_name'
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: "app_user_phone_key"
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at'
    }
  }, {
    sequelize,
    tableName: 'app_user',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "app_user_email_key",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "app_user_phone_key",
        unique: true,
        fields: [
          { name: "phone" },
        ]
      },
      {
        name: "app_user_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return AppUser;
  }
}
