const dataBase = {
  instances: [
    {id:'58204fab-6140-4854a61b2e', state:'Stopped', time: 1709848246401},
    {id:'3224334ab-6140-3535a61b2e', state:'Running', time: 1324448246401},
  ],

  add(id) { // функция в объекте (для добавления пользователей)
    const obj = {
      id,
      state: 'Stopped',
      time: Date.now(),
    }
    this.instances.push(obj);
    return obj;
  },
};

module.exports = dataBase;
