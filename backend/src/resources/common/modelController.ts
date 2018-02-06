import { IConfig } from '../../config';
import { Sequelize } from 'sequelize';

export class ModelController {
  constructor(protected db: Sequelize, protected config: IConfig) {}
}

export interface PageInformation {
  totalPages: number;
  page: number;
  pageSize: number;
}
