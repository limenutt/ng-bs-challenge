import { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from 'express';
/**
 * Convenience wraper for express-style middleware
 *
 * @param      {Function}  handler Request handler function that returns a promise of the response payload
 * @return     {<type>}    { Generated express middleware }
 */
export function w<Req extends Object, Res extends Object>(
  handler: (body: Req, req?: ExpressRequest, res?: ExpressResponse) => Promise<Res>) {
  return (req: ExpressRequest, res: ExpressResponse, next: NextFunction) =>
    handler(req.body, req, res).then(val => res.send(val))
      .catch(next);
}

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func: Function): string[] {
  const fnStr = func.toString().replace(STRIP_COMMENTS, '');
  let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if (result === null) {
    result = [];
  }
  return result;
}
/**
 * Convenience wraper for mocha suites
 *
 * @param      {Function}  done    The done
 * @return     {<type>}    { description_of_the_return_value }
 */
export const wt = (fn: (done?: Function) => Promise<any>) => {
  return async (done: Function) => {
    try {
      const fnParams = getParamNames(fn);
      if (fnParams.length) {
        await fn(done);
      } else {
        await fn();
        done();
      }
    } catch (err) {
      done(err);
    }
  };
};
