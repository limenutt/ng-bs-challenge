import { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';

import { ItemRequest, UserRequest } from '../../middleware/validate';
import { w } from '../../util';
import { ModelController, PageInformation } from '../common/modelController';

import { IProject } from './model';

export class ProjectsController extends ModelController {
  public get list() {
    // Consider moving pagination logic to ModelController
    return w<IProject, { projects: IProject[] } & PageInformation>(async (body, req: UserRequest) => {
      const startPage = 1;
      const defaultPageSize = 5;
      const maxPageSize = 20;

      let page: number = req.query.page && parseInt(req.query.page, 10);
      if (!page || page < startPage) {
        page = startPage;
      }
      let pageSize = req.query.pageSize && parseInt(req.query.pageSize, 10);
      if (!pageSize || pageSize < 1) {
        pageSize = defaultPageSize;
      } else {
        pageSize = Math.min(pageSize, maxPageSize);
      }
      const offset = (page - startPage) * pageSize;
      const result = await this.db.model<IProject, IProject>('project').findAndCountAll({
        where: {
          userId: req.currentUser.id
        },
        limit: pageSize,
        offset
      });
      const projects = result.rows;
      const totalRecords = result.count;
      const totalPages = (totalRecords - (totalRecords % pageSize)) / pageSize + ((totalRecords % pageSize) > 0 ? 1 : 0);
      return  { page, pageSize, totalPages, projects };
    });
  }
  public async get(req: ItemRequest, res: Response, next: NextFunction) {
    res.send({ project: req.items.project });
  }
  public get update() {
    return w<IProject, { project: IProject }>(async (body, req: ItemRequest) => {
      const projectToUpdate = body;
      projectToUpdate.id = req.items.project.id;
      await this.db.model<IProject, IProject>('project').upsert(body, {
        fields: ['name', 'description', 'status', 'completed'] }
      );
      const project = await this.db.model<IProject, IProject>('project').findById(req.items.project.id);
      return { project };
    });
  }
  public get delete() {
    return w<any, { success: true }>(async (body, req: ItemRequest) => {
      await this.db.model('project').destroy({ where: {
        id: { [Op.eq]: req.items.project.id }
      }});
      return { success: true };
    });
  }
  public get create() {
    return w<IProject, { project: IProject }>(async (body, req: UserRequest, res: Response) => {
      const projectToCreate = body;
      projectToCreate.userId = req.currentUser.id;
      const project = await this.db.model<IProject, IProject>('project').create(body, {
        fields: ['name', 'description', 'status', 'completed', 'userId']
      });
      res.status(201);
      return { project };
    });
  }
}
