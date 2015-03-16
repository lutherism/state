var React = require('react'),
  Unreads = require('../../stores/UnreadMessagesStore'),
  Messages = require('../../stores/MessageStore'),
  Threads = require('../../stores/ThreadStore');

var App = React.createClass({displayName: "App",
  render: function() {
    return (
      React.createElement("div", null,
        "Number unread: " + Object.keys(this.state.unreads).length,
        React.createElement("ul", null,
        Object.keys(this.state.threads).map(function createThreadItem(threadId) {
          return (
            React.createElement("li", {key: threadId},
              "Thread ID " + threadId,
              "Messages: " + Object.keys(this.state.threads[threadId]).length,
              React.createElement("ul", null,
                Object.keys(this.state.threads[threadId]).map(function createMessageItem(messageId) {
                  var style;
                  var message = this.state.messages[messageId];
                  if (message) {
                    if (this.state.unreads[messageId]) style = {
                      backgroundColor: "rgba(255, 0, 0, 0.4)"
                    };
                    return (
                      React.createElement("li", {onClick: this.readMessage.bind(this, message),
                        key: messageId, style: style},
                        message.message,
                        React.createElement("button", {
                          onClick: this.deleteMessage.bind(this, message)},
                          "Delete"
                        )
                      )
                    );
                  }
                }.bind(this))
              ),
              React.createElement("label", null, "Reply:"),
              React.createElement("textarea", {onChange: this.threadInput.bind(this, threadId),
                value: this.state.threadText[threadId]}),
              React.createElement("button", {onClick: this.submitMessage.bind(this, threadId)},
                "Submit"
              )
            )
          )
        }.bind(this))
        )
      )
    );
  },

  statics: {
    requiredStores: [Unreads, Messages, Threads]
  },

  threadInput: function(threadId, e) {
    var newThreadInput = this.state.threadText;
    newThreadInput[threadId] = e.target.value;
    this.setState({
      threadText: newThreadInput
    });
  },

  submitMessage: function(threadId, e) {
    e.preventDefault();
    e.stopPropagation();

    var message = {
      message: this.state.threadText[threadId],
      thread: threadId
    };

    this.props.state.dispatch({
      source: "VIEW",
      action: {
        type: "create_message",
        data: message
      }
    });
    var newInputState = this.state.threadText;
    newInputState[threadId] = "";

    this.setState({
      threadText: newInputState
    });
  },

  deleteMessage: function(message, e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.state.dispatch({
      source: "VIEW",
      action: {
        type: "remove_message",
        data: message
      }
    });
  },

  readMessage: function(message, e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.state.dispatch({
      source: "VIEW",
      action: {
        type: "read_message",
        data: message
      }
    });
  },

  getInitialState: function() {
    var newState = {
      messages: this.props.state.stores.MessageStore.dehydrate().messages || {},
      unreads: this.props.state.stores.UnreadMessagesStore.dehydrate().unreads || {},
      threads: this.props.state.stores.ThreadStore.dehydrate().threads || {},
      threadText: {}
    };
    console.log(newState);
    return newState;
  },
  componentWillMount: function() {
    this.props.state.listenToStores([Unreads, Messages, Threads],
      this.handleEmit.bind(this));
  },
  handleEmit: function() {
    this.setState(this.getInitialState());
  }
});

module.exports = App;
