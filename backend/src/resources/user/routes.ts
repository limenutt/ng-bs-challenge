import { Express } from 'express';
import { Sequelize } from 'sequelize';

import { IConfig } from '../../config';
import { Validate } from '../../middleware/validate';
import { UsersController } from './controller';

const routes = (app: Express, db: Sequelize, config: IConfig) => {
  const controller = new UsersController(db, config);

  app.post('/auth/signup', Validate.body(['email', 'password']), controller.signup);
  app.post('/auth/signin', Validate.body(['email', 'password']), controller.signin);

  app.get('/users/me', Validate.user(db, config), controller.me);

};
export = routes;
