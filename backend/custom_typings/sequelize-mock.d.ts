declare module 'sequelize-mock' {
  import * as Sequelize from 'sequelize';
  import { Model as SequelizeModel } from 'sequelize';
  class SequelizeMock extends Sequelize {}
  namespace SequelizeMock {}
  export = SequelizeMock;
}