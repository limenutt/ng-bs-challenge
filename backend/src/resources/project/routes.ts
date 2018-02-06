import { Express } from 'express';
import { Sequelize } from 'sequelize';

import { IConfig } from '../../config';
import { Validate } from '../../middleware/validate';
import { ProjectsController } from './controller';

const routes = (app: Express, db: Sequelize, config: IConfig) => {
  const controller = new ProjectsController(db, config);
  app.all('/projects*', Validate.user(db, config));

  app.get('/projects', controller.list);
  app.post('/projects', Validate.body(['name']), controller.create);

  app.all('/projects/:id*', Validate.item(db, 'project'), Validate.access(db, 'project'));
  app.get('/projects/:id', controller.get);
  app.put('/projects/:id', controller.update);
  app.delete('/projects/:id', controller.delete);
};
export = routes;
