const supportedErrors = ['ClientError', 'SequelizeUniqueConstraintError'];

/**
 * Client error factory
 *
 * @class      ClientError (name)
 */
export class ClientError extends Error {
  public code: number;
  constructor(humanMessage: string, code?: number) {
    super(humanMessage);
    this.name = 'ClientError';
    this.code = code;
  }
  public static authenticationError(): ClientError {
    return new ClientError('Unauthenticated', 401);
  }
  public static authorisationError(): ClientError {
    return new ClientError('Unauthorised', 403);
  }
  public static notFoundError(object: string, id?: string): ClientError {
    if (!id) {
      return new ClientError(`${object} not found`, 404);
    } else {
      return new ClientError(`${object} with id [${id}] not found`, 404);
    }
  }
  public static insufficientFundsError(currency: 'coins' | 'gold'): ClientError {
    return new ClientError(`Not enough ${currency}`);
  }
  public static isClientError(error: Error): error is ClientError {
    return supportedErrors.indexOf(error.name) !== -1;
  }
  public static toClientError(error: Error): ClientError {
    switch (error.name) {
      case 'ClientError':
        return <ClientError>error;
      case 'UnauthorizedError':
        return this.authenticationError();
      case 'SequelizeUniqueConstraintError':
        return new ClientError('Data model validation error');
      default:
        throw new Error(`Unsupported client error class ${error.name}`);
    }
  }
}
