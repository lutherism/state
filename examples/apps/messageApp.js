var State = require('../../state'),
  MessageStore = require('../stores/messageStore'),
  UnreadMessagesStore = require('../stores/unreadMessagesStore'),
  ThreadStore = require('../stores/threadStore');

var state = new State();


state.register(MessageStore)
  .register(UnreadMessagesStore)
  .register(ThreadStore);

var numChangeEmits = 0;

state.listenToStores(['MessageStore', 'ThreadStore', 'UnreadMessagesStore'], function() {
  numChangeEmits++;
  console.log("emit", numChangeEmits);
});

function dispatchMessage(message) {
  state.dispatch({
    source: "SERVER",
    action: {
      data: message,
      type: "create_message"
    }
  });
}

var messageExamples = [
  {
    id: "1",
    message: "hello",
    thread: "1"
  }, {
    id: "2",
    message: "goodbye",
    thread: "1"
  }, {
    id: "3",
    message: "other thread",
    thread: "2"
  }, {
    id: "4",
    message: "hello other thread",
    thread: "2"
  }, {
    id: "5",
    message: "original thread",
    thread: "1"
  }
];

messageExamples.map(dispatchMessage);

state.dispatch({
  source: "VIEW",
  action: {
    type: "read_message",
    data: {
      id: "3"
    }
  }
});

// Change events with this structure: 6
// Change events without this structure: 16

// num changes = num stores * num actions
// num changes = num actions
