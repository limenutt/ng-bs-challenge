import { Sequelize } from 'sequelize';

import { initModel as projectModel } from './project/model';
import { initModel as userModel } from './user/model';

const models = async (db: Sequelize) => {
  userModel(db);
  projectModel(db);
};
export = models;
