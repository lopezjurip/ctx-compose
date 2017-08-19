/* eslint no-console: 0 */

const composeSync = require("../../fp/sync");

function log(ctx, next) {
  console.log(">>>", ctx.value);
  const nextCtx = next();
  console.log("<<<", nextCtx.value);
  return nextCtx; // Explicit context return.
}

function increaser(ctx) {
  ctx.value = ctx.value + 1;
  return ctx; // Explicit context return.
}

const middleware = [log, increaser];
try {
  const context = composeSync(middleware)({ value: 4 });
  console.log("Value:", context.value);
} catch (err) {
  console.error(err);
}
