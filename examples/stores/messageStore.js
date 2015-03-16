var State = require('../../state');

var MessageStore = State.createStore({
  storeName: "MessageStore",
  handlers: {
    'SERVER': "handleServerPayload",
    'VIEW': "handleViewPayload"
  },
  initialize: function() {
    this.messages = {};

    return this;
  },
  handleServerPayload: function(payload) {
    switch (payload.action.type) {
      case 'create_message':
        this.changeMessage(payload.action.data);
        break;
      case 'delete_message':
        this.destroyMessage(payload.action.data);
        break;
      case 'change_message':
        this.changeMessage(payload.action.data);
        break;
    }
  },
  handleViewPayload: function(payload) {
    switch (payload.action.type) {
      case 'create_message':
        this.changeMessage(payload.action.data);
        break;
      case 'delete_message':
        this.destroyMessage(payload.action.data);
        break;
      case 'change_message':
        this.changeMessage(payload.action.data);
        break;
    }
  },
  changeMessage: function(data) {
    if (!data.id) {
      data.id = Math.floor(Math.random() * 10000);
      this.newestId = data.id;
    }
    this.messages[data.id] = data;
    this.emitChange();
  },
  destroyMessage: function(data) {
    delete this.messages[data.id];
    this.emitChange();
  },
  dehydrate: function() {
    return {
      messages: this.messages
    };
  },
  hydrate: function(state) {
    if (state.messages) {
      this.messages = state.messages;
      this.emitChange();
    }
  }
});

module.exports = MessageStore;
