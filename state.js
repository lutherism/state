var events = require('events'),
  util = require('util');

function State() {
    this.stores = {};
    this.dispatching = false;
    this.listeners = [];
    this.run = {};
    this.changedBuffer = {};
}

State.prototype.register = function register(StoreClass) {
  if (this.stores[StoreClass.storeName]) {
    throw "Store " + store.storeName + " already registered";
  }

  var store = new StoreClass({
    dispatcher: this
  });

  this.stores[store.storeName] = store;

  store.on('change:emit', function() {
    this.bufferChange(store);
    console.log("change event");
  }.bind(this));

  return this;
}

State.prototype.bufferChange = function (store) {
  if (!this.dispatching) {
    throw store.storeName + " emitted a change outside of a dispatch loop";
  }
  this.changedBuffer[store.storeName] = true;
}

State.prototype.listenToStores = function (stores, callback, ctx) {
  var args = Array.prototype.slice.call(arguments, 3);

  var storeNames = stores.map(function(store) {
    if (!this.stores[store.storeName]) {
      this.register(store);
    }
    return store.storeName;
  }.bind(this));

  return "_" + this.listeners.push({
    stores: storeNames,
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
  this.alertChanges();
  this.dispatching = false;
}

State.prototype.dehydrate = function() {
  var ret = {};
  this.mapStores(function (store) {
    ret[store.storeName] = store.dehydrate();
  });
  return ret;
}

State.prototype.waitFor = function(stores) {
  stores.map(function(store) {
    if (!this.run[store.storeName]) {
      this.run[storeName] = true;
      store[store.handlers[payload.source]](this.runningPayload);
    }
  }.bind(this))
}

State.prototype.dispatch = function(payload) {
  this.dispatching = true;
  this.run = {};
  this.runningPayload = payload;

  this.mapStores(function (store) {
    if (store.handlers[payload.source] && !this.run[store.storeName]) {
      store[store.handlers[payload.source]](payload);
    }
  }.bind(this));

  this.dispatching = false;
  this.runningPayload = null;

  this.alertChanges();
}

State.prototype.alertChanges = function() {
  this.listeners.map(function (listening) {
    var shouldRecieveChange = false;
    listening.stores.map(function (storeName) {
      shouldRecieveChange = !!(shouldRecieveChange || this.changedBuffer[storeName]);
    }.bind(this));
    if (shouldRecieveChange) {
      listening.callback.apply(listening.ctx);
    }
  }.bind(this));

  this.changedBuffer = {};
}

State.prototype.clearListeners = function() {
  this.listeners = [];
}

function inheritClass(parent, proto) {
  function Surrogate() {
    parent.apply(this, arguments);
  }

  util.inherits(Surrogate, parent);

  util._extend(Surrogate.prototype, proto);

  Surrogate.storeName = proto.storeName;

  return Surrogate;
}

var BaseStore = function BaseStore(opts) {
  this.state = {};
  this.initialize && this.initialize(opts);
  events.EventEmitter.apply(this, arguments);
}

util.inherits(BaseStore, events.EventEmitter);

util._extend(BaseStore.prototype, {
  storeName: "base",
  emitChange: function() {
    this.emit('change:emit');
  },
  dehydrate: function() {
  },
  hydrate: function() {
  }
});

module.exports = {
  createContext: function(stores, dehyrdatedState) {
    var newState = new State();
    stores.map(function (store) {
      newState.register(store);
    });
    dehyrdatedState && newState.hydrate(dehyrdatedState);

    return newState;
  },
  createStore: inheritClass.bind(this, BaseStore)
};
