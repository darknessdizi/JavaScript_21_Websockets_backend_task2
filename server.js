const Koa = require('koa');
const koaBody = require('koa-body');
const WS = require('ws'); // сервер для WebSocket от клиентов
const cors = require('@koa/cors');
const http = require('http');
const router = require('./routes'); // импортируем набор роутеров по файлу index.js в папке
const dataBase = require('./db');
const uuid = require('uuid');

const app = new Koa();

app.use(koaBody({ // чтобы обработать тело запроса (обязательно объявить до Middleware где работаем с body)
  urlencoded: true, // иначе тело будет undefined (тело будет строкой)
  multipart: true, // если тело запроса закодировано через FormData
}));

app.use(cors()); // задаем правила для политики CORS 
app.use(router()); // подключаем маршрутизатор

const port = process.env.PORT || 9000;
const server = http.createServer(app.callback());
const wsServer = new WS.Server({
  server
});

function createInstance(ws, obj) {
  // Создание instance
  const id = uuid.v4();
  ws.send(JSON.stringify({ 
    status: `Received`, 
    data: {
      id,
      command: obj.command,
      time: Date.now(),
    }
  }));

  setTimeout(() => {
    const instance = dataBase.add(id);
    ws.send(JSON.stringify({
      status: `Created`,
      data: instance,
    }));
  }, 20000);
}

function deleteInstance(ws, obj) {
  // Удаление instance
  ws.send(JSON.stringify({ 
    status: `Received`, 
    data: {
      id: obj.id,
      command: obj.command,
      time: Date.now(),
    }
  }));

  setTimeout(() => {
    dataBase.del(obj.id);
    ws.send(JSON.stringify({
      status: `Removed`,
      data: {
        id: obj.id,
        time: Date.now(),
      },
    }));
  }, 10000);
}

function changeInstance(ws, obj) {
  // Запуск (останов) instance
  ws.send(JSON.stringify({ 
    status: `Received`, 
    data: {
      id: obj.id,
      command: obj.command,
      time: Date.now(),
    }
  }));

  setTimeout(() => {
    const instance = dataBase.change(obj.id, obj.command);
    const status = instance.state === 'Stopped' ? 'Stopped' : `Started`;
    ws.send(JSON.stringify({
      status,
      data: instance,
    }));
  }, 5000);
}

wsServer.on('connection', (ws) => { // ws и есть сам клиент
  console.log('Соединение с клиентом');

  ws.on('message', (body) => {
    const obj = JSON.parse(body);
    if (obj.command === 'Create command') {
      createInstance(ws, obj);
    }
    if (obj.command === 'Delete command') {
      deleteInstance(ws, obj);
    }
    if ((obj.command === 'Start command') || (obj.command === 'Pause command')) {
      changeInstance(ws, obj);
    }
  });

  ws.on('close', (number) => {
    console.log('Соединение закрыто', number);
  });
}); 

server.listen(port, (err) => {
  // два аргумента (1-й это порт, 2-й это callback по результатам запуска сервера)
  if (err) { // в callback может быть передана ошибка
    // (выводим её в консоль для примера, если она появится)
    console.log(err);
    return;
  }
  console.log('Server is listening to 9000 port ************************');
});
