var events = require('events'),
  util = require('util');

function inheritClass(parent, proto) {
  function Surrogate() {
    parent.apply(this, arguments);
  }

  util.inherits(Surrogate, parent);

  Surrogate.createClass = inheritClass.bind(this, Surrogate);

  util._extend(Surrogate.prototype, proto);

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
  getInitialState: function() {
    return {};
  },
  dehydrate: function() {
    return this.state;
  },
  hydrate: function(state) {
    this.state = state;

    this.emitChange();
  },
});

BaseStore.createClass = inheritClass.bind(this, BaseStore);

module.exports = BaseStore;
