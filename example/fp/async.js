/* eslint no-console: 0 */

const compose = require("../../fp/async");
const Bluebird = require("bluebird");

async function log(ctx, next) {
  console.log(">>>", ctx.value);
  const nextCtx = await next();
  console.log("<<<", nextCtx.value);
  return nextCtx; // Explicit context return.
}

async function increaser(ctx) {
  await Bluebird.delay(1000); // wait 1000ms
  ctx.value = ctx.value + 1;
  return ctx; // Explicit context return.
}

const middleware = [log, increaser];
compose(middleware)({ value: 4 })
  .then(context => {
    console.log("Value:", context.value);
  })
  .catch(err => {
    console.error(err);
  });
