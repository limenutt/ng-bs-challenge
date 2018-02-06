import * as Sequelize from 'sequelize';

export const initModel = (db: Sequelize.Sequelize) => {
  db.define<IUser, IUser>(
    'user',
    {
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        type: Sequelize.STRING
      },
      passwordSalt: {
        type: Sequelize.STRING
      }
    },
    {
      timestamps: true
    }
  );
};
export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordSalt: string;
}
