function State() {
    this.stores = {};
    this.dispatching = false;
    this.listeners = [];
    this.changedBuffer = {};
}

State.prototype.register = function register(StoreClass) {
  if (this.stores[StoreClass.storeName]) {
    throw "Store " + store.storeName + " already registered";
  }

  var store = new StoreClass({
    dispatcher: this
  })

  this.stores[store.storeName] = {
    listeners: [],
    instance: store
  };

  store.on('change:emit', function() {
    this.enQueueChange(store);
    console.log("change event");
  }.bind(this));

  return this;
}

State.prototype.enQueueChange = function (store) {
  if (!this.dispatching) {
    throw store.storeName + " emitted a change outside of a dispatch loop";
  }
  this.changedBuffer[store.storeName] = true;
}

State.prototype.listenToStores = function (stores, callback, ctx) {
  var args = Array.prototype.slice.call(arguments, 3);
  return "_" + this.listeners.push({
    stores: stores,
    callback: callback,
    ctx: ctx
  });
}

State.prototype.unListen = function(index) {
  var id = parseInt(index.slice(1));
  delete this.listeners[id];
}

State.prototype.mapStores = function(cb) {
  var ret = {};
  cb.bind(this);
  for (var storeName in this.stores) {
    ret[storeName] = cb(this.stores[storeName]);
  }
  return ret;
}

State.prototype.hydrate = function(state) {
  this.dispatching = true;
  for (var storeName in state) {
    if (this.stores[storeName]) {
      this.stores[storeName].hydrate(state[storeName]);
    }
  }
  this.alertChange();
  this.dispatching = false;
}

State.prototype.dehydrate = function() {
  var ret = {};
  this.mapStores(function (store) {
    ret[store.instance.storeName] = store.instance.dehydrate();
  });
  return ret;
}

State.prototype.dispatch = function(payload) {
  this.dispatching = true;

  this.mapStores(function (store) {
    if (store.instance.handlers[payload.source]) {
      store.instance[store.instance.handlers[payload.source]](payload);
    }
  });

  this.dispatching = false;

  this.alertChanges();
}

State.prototype.alertChanges = function() {
  this.listeners.map(function (listening) {
    var shouldRecieveChange = false;
    listening.stores.map(function (store) {
      shouldRecieveChange = !!(shouldRecieveChange || this.changedBuffer[store]);
    }.bind(this));
    if (shouldRecieveChange) {
      listening.callback.apply(listening.ctx);
    }
  }.bind(this));

  this.changedBuffer = {};
}

module.exports = State;
