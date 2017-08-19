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
 * of all those which are passed in a sync way.
 *
 * @param {Array} middleware
 * @param {Function} clone
 * @return {Function}
 * @api public
 */

module.exports = function composeSync(middleware, clone = cloneObject) {
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
   * @return {undefined}
   * @api public
   */

  return function(context, next) {
    // last called middleware #
    let index = -1;

    function dispatch(ctx, i) {
      if (i <= index) {
        new MultipleNextCallsError();
      }
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) {
        return ctx;
      }
      const nextCtx = clone(ctx);
      return fn(nextCtx, function next() {
        return dispatch(nextCtx, i + 1);
      });
    }

    return dispatch(context, 0);
  };
};
