import { NextFunction, Request, RequestHandler, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { Op, Sequelize } from 'sequelize';
import * as winston from 'winston';

import { ExtendedRequest } from '../common/extendedRequest';
import { IConfig } from '../config';
import { ClientError } from '../errors/clientError';

import { IProject } from '../resources/project/model';
import { IUser } from '../resources/user/model';

export type UserRequest = ExtendedRequest<{currentUser: IUser }>;
export type ItemRequest = UserRequest & {
  items: { [name: string]: any}
};

interface ITokenPayload {
  id: string;
}
/**
 * Factory for validation middleware
 *
 * @class      Validate (name)
 */
export class Validate {
  /**
   * Checks if record exists, if it does, sets it to the request context
   *
   * @param      {<type>}    db      The database
   * @param      {<type>}    model   The model name
   */
  public static item(db: Sequelize, model: string) {
    return async (req: ItemRequest, res: Response, next: NextFunction) => {
      try {
        const instance = await db.model(model).findOne({ where: { id: {[Op.eq]: req.params.id }}});
        if (!instance) {
          throw ClientError.notFoundError(model, req.params.id);
        }
        if (!req.items) {
          req.items = {};
        }
        req.items[model] = instance;
        next();
      } catch (e) {
        next(e);
      }
    };
  }
  /**
   * Checks if user has access to the record
   *
   * @param      {<type>}    db      The database
   * @param      {<type>}    model   The model
   */
  public static access(db: Sequelize, model: string) {
    return async (req: ItemRequest, res: Response, next: NextFunction) => {
      try {
        switch (model) {
          // on a later stage this should be replaced by a permission matrix- or ACL-based security model
          case 'project': {
              if (req.items.project) {
                const project = <IProject>req.items.project;
                if (project.userId !== req.currentUser.id) {
                  throw ClientError.authorisationError();
                }
                return next();
              }
              const userProjectsCount = await db.model('project').count({ where: { [Op.and]: [
                { userId: { [Op.eq]: req.currentUser.id }},
                { id: req.param('id')}
              ]}});
              if (!userProjectsCount) {
                throw ClientError.authorisationError();
              }
            }
            break;
          default:
            throw new Error(`Unable to detemine access check strategy for model [${model}]`);
        }
        next();
      } catch (error) {
        next(error);
      }
    };
  }
  /**
   * Check if there is a logged it user, sets the user to the request context
   *
   * @param      {<type>}    db      The database
   * @param      {<type>}    config  The configuration
   */
  public static user(db: Sequelize, config: IConfig): RequestHandler {
    return async (req: UserRequest, res: Response, next: NextFunction) => {
      const authorization = req.header('authorization');
      if (!authorization) {
        next(ClientError.authenticationError());
        return;
      }
      const token = authorization.split(' ')[1];
      if (!token) {
        next(ClientError.authenticationError());
        return;
      }
      try {
        const decodedToken = <ITokenPayload>verify(token, config.service.security.jwtSecret);
        const userId = decodedToken.id;
        const user = await db.model<IUser, IUser>('user').findOne<IUser>({ where: { id: {[Op.eq]: userId} }});
        if (!user) {
          next(ClientError.authenticationError());
          return;
        }
        req.currentUser = user;
        next();
      } catch (e) {
        const error: Error = e;
        winston.error(error.message);
        winston.error(error.stack);
        next(ClientError.authenticationError());
      }
    };
  }
  /**
   * Validates required proprties of the payload
   *
   * @param      {<type>}    properties  The required properties
   */
  public static body(properties: string[]): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      const passedProperties = Object.keys(req.body);
      const missingProperties = properties.filter(p => !passedProperties.includes(p));
      if (missingProperties.length) {
        next(new ClientError(`Payload is missing properties [${missingProperties.join(',')}]`));
      } else {
        next();
      }
    };
  }
}
