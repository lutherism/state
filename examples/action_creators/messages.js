var reqwest = require('reqwest');

module.exports = {
  createMessage: function(state, message) {
    message.id = Math.floor(Math.random() * 10000);
    reqwest({
      url: 'create_message',
      method: 'post',
      type: 'json',
      contentType: 'application/json',
      data: message,
      success: function(data) {
        state.dispatch({
          source: 'SERVER',
          action: {
            type: "create_message",
            data: data
          }
        });
      }
    });

    state.dispatch({
      source: "VIEW",
      action: {
        type: "create_message",
        data: message
      }
    });
  }
}
