const {
  MiddlewareArrayOfFunctionsError,
  MiddlewareMustBeArrayError,
  MultipleNextCallsError,
} = require("./errors");

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

module.exports = function composeAsync(middleware) {
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
   * @return {Promise}
   * @api public
   */

  return function(context, next) {
    // last called middleware #
    let index = -1;

    function dispatch(i) {
      if (i <= index) {
        return Promise.reject(new MultipleNextCallsError());
      }
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) {
        return Promise.resolve();
      }
      try {
        return Promise.resolve(
          fn(context, function next() {
            return dispatch(i + 1);
          })
        );
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return dispatch(0);
  };
};
