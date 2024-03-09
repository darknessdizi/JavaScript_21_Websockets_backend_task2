const dataBase = {
  instances: [
    {id:'58204fab-6140-4854a61b2e', state:'Stopped', time: 1709848246401},
    {id:'3224334ab-6140-3535a61b2e', state:'Running', time: 1324448246401},
  ],

  add(id) {
    const obj = {
      id,
      state: 'Stopped',
      time: Date.now(),
    }
    this.instances.push(obj);
    return obj;
  },

  del(id) {
    const index = this.instances.findIndex((item) => item.id === id);
    this.instances.splice(index, 1);
  },

  change(id, command) {
    const state = command.includes('Pause') ? 'Stopped' : 'Running';
    const index = this.instances.findIndex((item) => item.id === id);
    this.instances[index].state = state;
    this.instances[index].time = Date.now();
    return this.instances[index];
  }
};

module.exports = dataBase;
