import * as should from 'should';

import { ConfigurationLoader, IConfig } from '../../config';
import { Server } from '../../server';
import { wt } from '../../util';
import { MySequelizeMock } from '../mocks/sequelize/sequelizeMock';

import { fork } from 'child_process';
import * as path from 'path';
import * as request from 'request-promise';
import { SinonSpy, spy, stub } from 'sinon';

class ProtectedServer extends Server {
  public db: MySequelizeMock;
}
const serverStartTimeout: number = 1000;
describe('Server', () => {
  let defaultConfig: IConfig;
  describe('start', function (): void {
    /* tslint:disable:mocha-no-side-effect-code */
    this.timeout(serverStartTimeout);
    /* tslint:enable:mocha-no-side-effect-code */
    let server: Server;
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
      server = new Server(defaultConfig, MySequelizeMock);
    }));
    it('should launch server on port set in config', wt(async () => {
      const endpoint = `http://localhost:${defaultConfig.server.port}`;
      await server.start();
      return should(request(`${endpoint}/ping`)).not.be.rejected;
    }));
  });
  describe('stop', () => {
    let server: Server;
    afterEach('Stop server', wt(async () => {
      if (server) {
        await server.stop();
        if ((<SinonSpy>(<ProtectedServer>server).db.close).restore) {
          (<SinonSpy>(<ProtectedServer>server).db.close).restore();
        }
      }
    }));
    beforeEach('create server', wt(async () => {
      defaultConfig = await ConfigurationLoader.load();
      server = new Server(defaultConfig, MySequelizeMock);
    }));
    it('should shut down web server', wt(async () => {
      const endpoint = `http://localhost:${defaultConfig.server.port}`;
      await server.start();
      await server.stop();
      return should(request(`${endpoint}/ping`)).be.rejected;
    }));
    it('should close db connection when stopped', wt(async () => {
      await server.start();
      const dbSpy = spy((<ProtectedServer>server).db, 'close');
      await server.stop();
      should(dbSpy.calledOnce).be.ok();
    }));
  });
  // skipping this one until sequelize mocking ability is supported in the app level
  describe.skip('gracefulStop', () => {
    it('should gracefuly stop and exit upon receiving a signal', wt(async (done) => {
      const execPath = path.join(__dirname, '../../app.js');
      const options = {
        env: { NODE_ENV: process.env.NODE_ENV }
      };
      const childProcess = fork(execPath, [], options);
      setTimeout(
        () => {
          childProcess.kill('SIGTERM');
        },
        serverStartTimeout);
      childProcess.on('exit', () => {
        done();
      });
    }));
  });
});
