/* tslint:disable: no-require-imports no-var-requires */
require('source-map-support').install();
if (!(<any>global)._babelPolyfill) {
  require('babel-polyfill');
}
import { ConfigurationLoader } from './config';
import { Server } from './server';

import * as winston from 'winston';
(async () => {
  const config = await ConfigurationLoader.load();
  winston.info(`Log level is set to [${config.service.logging.level}]`);
  (<any>winston).level = config.service.logging.level;
  const server = new Server(config);
  await server.start();
})().catch(error => winston.error(error.stack));
