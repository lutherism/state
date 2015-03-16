var State = require('../../state');

var UnreadMessagesStore = State.createStore({
  storeName: "UnreadMessagesStore",
  handlers: {
    'SERVER': "handleServerPayload",
    'VIEW': "handleViewPayload"
  },
  initialize: function() {
    this.unreads = {};
  },
  handleViewPayload: function(payload) {
    switch (payload.action.type) {
      case 'read_message':
        this.handleMessageRead(payload.action.data);
        break;
      case 'remove_message':
        this.handleMessageRead(payload.action.data);
    }
  },
  handleServerPayload: function(payload) {
    switch (payload.action.type) {
      case 'create_message':
        this.handleNewMessage(payload.action.data);
        break;
      case 'read_message':
        this.handleMessageRead(payload.action.data);
        break;
      case 'remove_message':
        this.handleMessageRead(payload.action.data);
    }
  },
  handleMessageRead: function(data) {
    if (data.id && this.unreads[data.id]) {
      delete this.unreads[data.id];
      this.emitChange();
    }
  },
  handleNewMessage: function(data) {
    if (data.id) {
      this.unreads[data.id] = true;
      this.emitChange();
    }
  },
  dehydrate: function() {
    return {
      unreads: this.unreads
    };
  },
  hydrate: function(state) {
    if (state.unreads) {
      this.unreads = state.unreads;
      this.emitChange();
    }
  }
});

module.exports = UnreadMessagesStore;
