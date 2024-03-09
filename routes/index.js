const combineRouters = require('koa-combine-routers');

const instances = require('./instances');

const router = combineRouters(
  instances,
);

module.exports = router;
