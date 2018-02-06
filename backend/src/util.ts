import { NextFunction, Request, Response } from 'express';

/**
 * Convenience wraper for express-style middleware
 *
 * @param      {Function}  handler Request handler function that returns a promise of the response payload
 * @return     {<type>}    { Generated express middleware }
 */
export function w<Req extends Object, Res extends Object>(handler: (body: Req, req?: Request, res?: Response) => Promise<Res>) {
  return (req: Request, res: Response, next: NextFunction) =>
    handler(req.body, req, res).then(val => res.send(val))
      .catch(next);
}
