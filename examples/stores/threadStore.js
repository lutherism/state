var State = require('../../state'),
  util = require('util');

var ThreadStore = State.createStore({
  storeName: "ThreadStore",
  handlers: {
    'SERVER': "handleServerPayload",
    'VIEW': "handleViewPayload"
  },
  initialize: function() {
    this.threads = {};
  },
  handleViewPayload: function(payload) {
    switch (payload.action.type) {
      case 'create_message':
        this.handleNewMessage(payload.action.data);
        break;
      case 'remove_message':
        this.handleDeleteMessage(payload.action.data);
        break;
    }
  },
  handleServerPayload: function(payload) {
    switch (payload.action.type) {
      case 'create_message':
        this.handleNewMessage(payload.action.data);
        break;
      case 'remove_message':
        this.handleDeleteMessage(payload.action.data);
        break;
    }
  },
  handleNewMessage: function(data) {
    if (!data.id) {
      dispatcher.waitFor([dispatcher.stores.MessageStore]);
      data.id = dispatcher.stores.MessageStore.newestId;
    }
    if (!this.threads[data.thread]) {
      this.threads[data.thread] = {};
      this.threads[data.thread][data.id] = true;
    } else if (!this.threads[data.thread][data.id]){
      this.threads[data.thread][data.id] = true;
    } else {
      return;
    }
    this.emitChange();
  },
  handleDeleteMessage: function(data) {
    if (this.threads[data.thread] &&
      this.threads[data.thread][data.id]) {
      delete this.threads[data.thread][data.id];
    }
    this.emitChange();
  },
  dehydrate: function() {
    return {
      threads: this.threads
    };
  },
  hydrate: function(state) {
    if (state.threads) {
      this.threads = state.threads;
      this.emitChange();
    }
  }
});

module.exports = ThreadStore;
