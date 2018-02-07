import { ConfigurationLoader, IConfig } from '../../config';
import { Server } from '../../server';
import { wt } from '../../util';
import { MySequelizeMock, SequelizeMockedModel } from '../mocks/sequelize/sequelizeMock';

import * as crypto from 'crypto';
import * as mocha from 'mocha';
import * as request from 'request-promise';
import { Model } from 'sequelize-mock';
import * as should from 'should';
import { SinonSpy, spy, stub } from 'sinon';

class ProtectedServer extends Server {
  public db: MySequelizeMock;
}

describe('API', () => {
  let server: ProtectedServer;
  let defaultConfig: IConfig;
  let endpoint: string;
  afterEach('Stop server', function(done: MochaDone): void {
    /* tslint:disable:mocha-no-side-effect-code */
    this.timeout(5000);
    /* tslint:enable:mocha-no-side-effect-code */
    if (server) {
      server.stop().then(() => done()).catch(done);
    }
  });
  beforeEach('create server', wt(async () => {
    defaultConfig = await ConfigurationLoader.load();
    server = <ProtectedServer>new Server(defaultConfig, MySequelizeMock);
    endpoint = `http://localhost:${defaultConfig.server.port}`;
    await server.start();
  }));
  describe('auth/signup', () => {
    it('should not create user without email and password', wt(async () => {
      const result = await request({
        method: 'POST',
        uri: `${endpoint}/auth/signup`,
        body: {},
        json: true,
        simple: false,
        resolveWithFullResponse: true
      });
      should(result.statusCode).equal(400);
      should(result.body.error).containEql('[email,password]');
    }));
    it('should create user with email and password and return a token', wt(async () => {
      const result = await request({
        method: 'POST',
        uri: `${endpoint}/auth/signup`,
        body: { email: 'a@a.a', password: 'a'},
        json: true
      });
      should(result.token.accessToken).be.ok();
      should(result.token.expiresAt).be.a.Number();
      should(result.token.now).be.a.Number();
      should(result.token.now).be.lessThan(result.token.expiresAt);
    }));
  });
  describe('auth/signin', () => {
    it('should not authenticate a user without email and password', wt(async () => {
      const result = await request({
        method: 'POST',
        uri: `${endpoint}/auth/signin`,
        body: {},
        json: true,
        simple: false,
        resolveWithFullResponse: true
      });
      should(result.statusCode).equal(400);
      should(result.body.error).containEql('[email,password]');
    }));
    it('should not authenticate with wrong email / password', wt(async () => {
      (<SequelizeMockedModel>(<any>server.db.model('user'))).$queueResult();
      const result = await request({
        method: 'POST',
        uri: `${endpoint}/auth/signin`,
        body: { email: 'a@a.a', password: 'a'},
        json: true,
        simple: false,
        resolveWithFullResponse: true
      });
      should(result.statusCode).equal(401);
    }));
    it('should authenticate with correct email / password', wt(async () => {
      const decryptedPassword = 'a';
      const passwordSalt = crypto.randomBytes(16).toString('base64');
      const encryptedPassword = crypto.pbkdf2Sync(decryptedPassword, passwordSalt, 10000, 64, 'sha512').toString('base64');
      const existingUser = { email: 'a@a.a', password: encryptedPassword, passwordSalt, id: 5 };
      (<SequelizeMockedModel>(<any>server.db.model('user'))).$queueResult(existingUser);
      const result = await request({
        method: 'POST',
        uri: `${endpoint}/auth/signin`,
        body: { email: existingUser.email, password: decryptedPassword },
        json: true
      });
      should(result.token.accessToken).be.ok();
      should(result.token.expiresAt).be.a.Number();
      should(result.token.now).be.a.Number();
      should(result.token.now).be.lessThan(result.token.expiresAt);
    }));
  });
});
