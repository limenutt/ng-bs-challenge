import * as BlueBird from 'bluebird';
import { SyncOptions } from 'sequelize';
import * as SequelizeMock from 'sequelize-mock';

export class MySequelizeMock extends SequelizeMock {
  public sync(options: SyncOptions): BlueBird<any> {
    return BlueBird.resolve();
  }
  public close(): any {; }
}

export class SequelizeMockedModel {
  public $queueResult(...args: any[]): void {; }
}
