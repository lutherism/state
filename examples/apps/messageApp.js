var state, string,
  App = require('../components/App.jsx'),
  React = require('react'),
  State = require('../../state');

var state = State.createContext(App.requiredStores, window.dehydratedState);

React.render(React.createElement(App, {state: state}), document.body);
