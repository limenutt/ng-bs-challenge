import { IConfig } from '../config';
import { Sequelize } from 'sequelize';

import * as projectRoutes from './project/routes';
import * as userRoutes from './user/routes';

import { Express } from 'express';

const routes = (app: Express, db: Sequelize, config: IConfig) => {
  userRoutes(app, db, config);
  projectRoutes(app, db, config);
};

export = routes;
