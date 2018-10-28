const State = {
  pending: 0,
  ready: 1
}

class Sub {

  constructor(data) {
    if (typeof data === 'string') {
      this.observe(data)
    } else {
      if (Array.isArray(data)) {
        data.forEach(item => {
          this.observe(item)
        })
      } else if (data instanceof Object) {
        let keys = Object.keys(data)
        keys.forEach(item => {
          this.observe(item)
        })
      }
    }
  }

  observe(field) {
    this[field] || (this[field] = {
      value = undefined,
      state = State.pending,
      onReady =[],
      onUpdate =[]
    })
  }

  update(field, value) {
    this.observe(field)
    let oldValue = this[field].value
    this[field].value = value
    if (this[field].state === State.pending) {
      this[field].state = State.ready
      this[field].onReady.forEach(callback => {
        callback.call(null, this[field].value, oldValue)
      });
      this[field].onUpdate.forEach(callback => {
        callback.call(null, this[field].value, oldValue)
      });
    } else {
      this[field].onUpdate.forEach(callback => {
        callback.call(null, this[field].value, oldValue)
      });
    }
  }

  onReady(field, callback) {
    this.observe(field)
    if (this[field].state === State.pending) {
      this[field].onReady.push(callback)
    } else {
      callback.call(null, this[field].value)
    }
  }

  onUpdate(field, callback) {
    this.observe(field)
    this[field].onUpdate.push(callback)
  }
}
