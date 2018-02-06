import { IConfig } from './config';
import { ClientError } from './errors/clientError';

import * as models from './resources/models';
import * as routes from './resources/routes';

import * as Sequelize from 'sequelize';
import * as winston from 'winston';

import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import { NextFunction, Request, RequestHandler, Response } from 'express';

import * as expressWinston from 'express-winston';

import { Server as HTTPServer } from 'http';

const signalsToStopOn: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];

export type SignalHandler = (...args: any[]) => void;
/**
 * Main API server class
 *
 * @class      Server (name)
 */
export class Server {

  protected app: express.Express;
  protected httpServer: HTTPServer;
  protected signalListeners: Map<string, SignalHandler>;
  protected db: Sequelize.Sequelize;
  constructor(protected config: IConfig) {
    this.signalListeners = new Map<string, SignalHandler>();
  }
  protected async loadDb() {
    this.db = new Sequelize(
      this.config.service.mysql.database,
      this.config.service.mysql.user, this.config.service.mysql.password, {
        host: this.config.service.mysql.host,
        dialect: 'mysql',
        operatorsAliases: true
      }
    );
    await this.db.authenticate();
    await models(this.db);
    await this.db.sync({
      // force: true
    });
  }
  /**
   * Starts the server
   *
   * @return     {Promise}  { }
   */
  public async start(): Promise<void> {
    try {
      await this.loadDb();

      this.app = express();

      // setting up the middleware chain
      // this.app.use(this.logRequest());
      this.app.use(bodyParser.json());
      if (this.config.server.origins.length) {
        this.app.use(cors({origin: this.config.server.origins}));
      }
      routes(this.app, this.db, this.config);

      this.app.use(this.handleError.bind(this));

      this.httpServer = this.app.listen(this.config.server.port);
      this.httpServer.once('close', this.cleanup);
      this.attachSignalListeners();
      winston.info(`Server is listening on [${this.httpServer.address().port}]`);
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }
  protected logRequest(): RequestHandler {
    return expressWinston.logger({
      transports: [
      new winston.transports.Console({
        json: true,
        colorize: true
      })
      ],
      msg: 'HTTP {{req.method}} {{req.url}}',
      expressFormat: true,
      colorize: false,
      ignoreRoute: (req, res) => false
    });
  }
  protected async handleError(error: Error, req: Request, res: Response, next: NextFunction) {
    await this.logError(error);
    if (ClientError.isClientError(error)) {
      const clientError = ClientError.toClientError(error);
      res.status(clientError.code || 400);
      res.send({ error: clientError.message });
    } else {
      res.status(500);
      res.send({ error: 'Unexpected server error' });
    }
  }
  /**
   * Stops the server
   *
   * @return     {Promise}  { }
   */
  public async stop(): Promise<void> {
    if (this.httpServer) {
      await new Promise<void>((resolve, reject) => {
        this.httpServer.close((error: Error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }
    this.detachSignalListeners();
  }
  /**
   * Cleans up the resources, closes connections, typically called on server shutdown
   *
   * @return     {Promise}  { }
   */
  protected async cleanup(): Promise<void> {
    await this.db.close();
  }

  private detachSignalListeners(): void {
    for (const signal of this.signalListeners.keys()) {
      process.removeListener(signal, this.signalListeners.get(signal));
    }
  }
  /**
   * Attaches listeners for signals to support graceful exit minimising the data loss.
   *
   * @param      {<type>}  signal  The signal
   * @return     {<type>}  { description_of_the_return_value }
   */
  private attachSignalListeners(): void {
    signalsToStopOn.forEach(signal => {
      const listener = this.gracefulStop(signal);
      process.on(signal, listener);
      this.signalListeners.set(signal, listener);
    });
  }
  private gracefulStop(signal: string): () => void {
    return () => {
      winston.info(`Graceful stopping due to signal [${signal}]`);
      this.stop().then(() => {
        winston.log('verbose', 'Graceful stopping complete');
        process.exit(0);
      }).catch(error => {
        winston.error('Graceful stopping failed', error);
        process.exit(0);
      });
    };
  }
  private logError(error: Error) {
    winston.error(error.message);
    winston.error(error.stack);
  }
}
