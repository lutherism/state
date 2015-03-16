var app = require('express')(),
  React = require('react'),
  State = require('./state'),
  fs = require('fs'),
  url = require('url'),
  path = require('path'),
  App = require('./examples/components/built/App');

function dispatchMessage(message) {
  state.dispatch({
    source: "SERVER",
    action: {
      data: message,
      type: "create_message"
    }
  });
}

var messages = [{
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

var state = State.createContext(App.requiredStores);

var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "jsx": "text/plain",
    "css": "text/css"
  };

messages.map(dispatchMessage);

app.get('/dist/client.js', function server(req, resp) {
  var uri = url.parse(req.url).pathname,
    t = Date.now();
  if (uri === '/') uri = path.join(uri, './dist/index.html');
  var filename = path.join(process.cwd(), uri);
  var mimeType = mimeTypes[uri.split(".")[1]];
  resp.writeHead(200, {
    'Content-Type': mimeType
  });
  if (fs.existsSync(filename)) {
    var fileStream = fs.createReadStream(filename);
    fileStream.pipe(resp);
    setTimeout(function() {
      fileStream.unpipe(resp);
      fileStream.close();
      resp.end();
    }, 10000);
  } else {
    resp.write("404");
    resp.end();
  }
  resp.once('finish', function() {
    console.log([(Date.now()-t), 'ms', req.method, req.url].join(' '));
  });
});

app.get('/', function(req, resp) {
  resp.writeHead(200, {
    'Content-Type': 'text/html'
  });
  resp.write(buildHtml());
})

app.post('/create_message', function(req, resp) {
  console.log(req);
  var message, postData = "";

  req.on('data', function(chunk) {
    postData += chunk.toString();
  });

  req.on('end', function() {
    message = url.parse("?" + postData, true).query;
    state.listenToStores([state.stores.MessageStore], function() {
      resp.writeHead(200, {
        'Content-Disposition': 'application/json'
      });
      resp.write(JSON.stringify(state.stores.MessageStore.messages[message.id]));
      resp.end();
      state.clearListeners();
    });

    state.dispatch({
      source: 'VIEW',
      action: {
        type: "create_message",
        data: message
      }
    });
  });
});

app.get("/messages", function(req, resp) {
  resp.writeHead(200, {
    'Content-Disposition': 'application/json'
  });
  resp.write(JSON.stringify(state.store.MessagesStore.dehydrate()));
});

function buildHtml() {
  var ret = (
    "<html>" +
    "<body>" +
    React.renderToString(React.createElement(App, {state: state})) +
    "</body>" +
    '<script>window.dehydratedState = ' +
    JSON.stringify(state.dehydrate()) + ';</script>' +
    '<script src="./dist/client.js"></script>' +
    "</html>"
  );
  state.clearListeners();
  return ret;
}

app.listen(8000);
