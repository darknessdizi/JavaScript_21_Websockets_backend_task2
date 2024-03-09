const Router = require('koa-router');
const uuid = require('uuid');
const { streamEvents } = require('http-event-stream');
const dataBase = require('../../db');

const router = new Router(); // создали роутер

// определяем для какого метода идет обработка запроса (post/get)
router.get('/instances', async (ctx) => {
  ctx.response.body = dataBase.instances;
  ctx.response.status = 200;
});

module.exports = router;
