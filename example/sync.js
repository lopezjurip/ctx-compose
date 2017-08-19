/* eslint no-console: 0 */

const composeSync = require("../sync");

function log(ctx, next) {
  console.log(">>>", ctx.value);
  next();
  console.log("<<<", ctx.value);
}

function increaser(ctx) {
  ctx.value = ctx.value + 1;
}

const context = { value: 4 };
const middleware = [log, increaser];

try {
  composeSync(middleware)(context);
  console.log("Value:", context.value);
} catch (err) {
  console.error(err);
}
