const {
  MiddlewareArrayOfFunctionsError,
  MiddlewareMustBeArrayError,
  MultipleNextCallsError,
} = require("./errors");

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed in a sync way.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

module.exports = function composeSync(middleware) {
  if (!Array.isArray(middleware)) {
    throw new MiddlewareMustBeArrayError();
  }
  for (const fn of middleware) {
    if (typeof fn !== "function") {
      throw new MiddlewareArrayOfFunctionsError();
    }
  }

  /**
   * @param {Object} context
   * @return {undefined}
   * @api public
   */

  return function(context, next) {
    // last called middleware #
    let index = -1;

    function dispatch(i) {
      if (i <= index) {
        new MultipleNextCallsError();
      }
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) {
        return undefined;
      }
      return fn(context, function next() {
        return dispatch(i + 1);
      });
    }

    return dispatch(0);
  };
};
