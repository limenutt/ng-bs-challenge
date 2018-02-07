import * as crypto from 'crypto';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { sign } from 'jsonwebtoken';

import { ExtendedRequest } from '../../common/extendedRequest';
import { ClientError } from '../../errors/clientError';
import { UserRequest } from '../../middleware/validate';
import { ModelController } from '../common/modelController';

import { IUser } from './model';

import { Op } from 'sequelize';

import { w } from '../../util';

export interface IRegistrationPayload {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}
export interface ILoginPayload {
  email: string;
  password: string;
}
export interface ITokenInfo {
  accessToken: string;
  expiresAt: number;
  now: number;
}
export interface IRegistrationResponse {
  token: ITokenInfo;
}
export class UsersController extends ModelController {
  get signup() {
    return w<IRegistrationPayload, IRegistrationResponse>(async body => {
      const userToCreate: IUser = <IUser>body;

      const passwordSalt = crypto.randomBytes(16).toString('base64');
      userToCreate.password = this.hashPassword(userToCreate.password, passwordSalt);
      const user = await this.db.model<IUser, IUser>('user').create(userToCreate);
      return {
        token: this.generateToken(user)
      };
    });
  }
  get signin() {
    return w<ILoginPayload, IRegistrationResponse>(async body => {
      const user = await this.db.model<IUser, IUser>('user').findOne({
        where: { email: { [Op.eq]: body.email } }
      });
      if (!user) {
        throw ClientError.authenticationError();
      }
      const hashedPassword = this.hashPassword(body.password, user.passwordSalt);
      if (hashedPassword !== user.password) {
        throw ClientError.authenticationError();
      }
      return {
        token: this.generateToken(user)
      };
    });
  }
  public me(req: UserRequest, res: Response, next: NextFunction) {
    const user = req.currentUser;
    const sanitisedUser = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.id
    };
    res.send({ user: sanitisedUser });
    next();
  }
  protected hashPassword(password: string | Buffer, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
  }
  protected generateToken(user: IUser): ITokenInfo {
    const dateNow = new Date();
    const expiresIn = this.config.service.security.tokenExpiresInMs;
    const dateExpiresAt = new Date(dateNow.getTime() + expiresIn);
    const accessToken = sign({ id: user.id.toString() }, 'secret', { expiresIn });
    return  {
      accessToken,
      expiresAt: dateExpiresAt.getTime(),
      now: dateNow.getTime()
    };
  }
}
