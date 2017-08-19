const cloneObject = require("./clone");
const {
  MiddlewareArrayOfFunctionsError,
  MiddlewareMustBeArrayError,
  CloneFunctionError,
  MultipleNextCallsError,
} = require("../errors");

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @param {Function} clone
 * @return {Function}
 * @api public
 */

module.exports = function composeAsync(middleware, clone = cloneObject) {
  if (!Array.isArray(middleware)) {
    throw new MiddlewareMustBeArrayError();
  }
  for (const fn of middleware) {
    if (typeof fn !== "function") {
      throw new MiddlewareArrayOfFunctionsError();
    }
  }
  if (typeof clone !== "function") {
    throw new CloneFunctionError();
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function(context, next) {
    // last called middleware #
    let index = -1;

    function dispatch(ctx, i) {
      if (i <= index) {
        return Promise.reject(new MultipleNextCallsError());
      }
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) {
        return Promise.resolve(ctx);
      }
      try {
        const nextCtx = clone(ctx);
        return Promise.resolve(
          fn(nextCtx, function next() {
            return dispatch(nextCtx, i + 1);
          })
        );
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return dispatch(context, 0);
  };
};
