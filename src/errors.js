exports = module.exports = {};
exports.MiddlewareMustBeArrayError = () =>
  TypeError("Middleware stack must be an array!");
exports.MiddlewareArrayOfFunctionsError = () =>
  TypeError("Middleware must be composed of functions!");
exports.CloneFunctionError = () =>
  TypeError("Functional compose function must have a 'clone' function.");
exports.MultipleNextCallsError = () => Error("next() called multiple times");
