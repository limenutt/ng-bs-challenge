export type LogLevel = 'verbose' | 'info' | 'warn' | 'error';
export interface IConfig {
  service: {
    mysql?: {
      host: string,
      port: number,
      database: string,
      user: string,
      password: string
    },
    logging?: {
      level: LogLevel
    },
    security: {
      jwtSecret: string,
      tokenExpiresInMs: number
    }
  };
  server: {
    port: number,
    origins: string[]
  };
}
/**
 * Loads configuration from environment, typically used on startup
 *
 * @class      ConfigurationLoader
 */
export class ConfigurationLoader {
  public static envG<T extends string>(name: string, defaultValue?: string): T {
    return <T>this.env(name, defaultValue);
  }
  public static env(name: string, defaultValue?: string): string {
    let val = process.env[name];
    if (val === undefined) {
      val = defaultValue;
    }
    return val;
  }
  public static envNumber(name: string, defaultValue?: number): number {
    const val = this.env(name, defaultValue && defaultValue.toString());
    if (val === undefined) {
      return undefined;
    }
    const numVal = parseInt(val, 10);
    if (isNaN(numVal)) {
      return undefined;
    }
    return numVal;
  }
  public static async load(): Promise<IConfig> {
    return {
      service: {
        mysql: {
          host: this.env('MYSQL_PORT_3306_TCP_ADDR', '127.0.0.1'),
          port: this.envNumber('MYSQL_PORT_3306_TCP_PORT', 3306),
          database: this.env('MYSQL_DB', 'ngbs'),
          user: this.env('MYSQL_DB_USER', 'root'),
          password: this.env('MYSQL_DB_PASSWORD')
        },
        logging: {
          level: this.envG<LogLevel>('LOG_LEVEL', 'verbose')
        },
        security: {
          jwtSecret: this.env('JWT_SECRET', 'secret'),
          tokenExpiresInMs: this.envNumber('JWT_EXPIRES_IN', 1000 * 60 * 60)
        }
      },
      server: {
        port: this.envNumber('SERVER_PORT', 3031),
        origins: []
      }
    };
  }
}
