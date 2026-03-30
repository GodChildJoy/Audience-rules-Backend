/**
 * Run a body parser that may throw `{ statusCode: 400, expose: true }` and attach the result.
 * @param {(body: unknown) => object} parser
 * @returns {import('express').RequestHandler}
 */
export function validateBody(parser) {
  return (req, res, next) => {
    try {
      req.validatedBody = parser(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * @param {string} paramName
 * @returns {import('express').RequestHandler}
 */
export function uuidParam(paramName) {
  return (req, res, next) => {
    const value = req.params[paramName];
    if (typeof value !== 'string' || !UUID_RE.test(value)) {
      next(
        Object.assign(new Error(`Invalid ${paramName}: must be a UUID`), {
          statusCode: 400,
          expose: true,
        }),
      );
      return;
    }
    next();
  };
}
