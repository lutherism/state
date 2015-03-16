# state
Tying the loop of flux. Using a two way dispatcher that batches store change events for performance and simplicity. Heavily influenced by Yahoo's Dispatchr.


## Batches change events by dispatch loops ##

5 new messages should trigger 5 change events, no matter how many stores
are concerned. IE recieveing a new message in a message app, updating the unread count shouldn't be
a seperate DOM update from adding the new message component

## Composes dehydrated states ##

Add `hydrate()` and `dehydrate()` methods to your stores, and state will compose JSON blobs which can be used to rehydrate your app back to a previous state. Very usefull for integration testing and server-side rendering.

## Enviorment agnostic State ##
The point of this architecture is to contain an App's entire state in a single smart javascript object which allows your app to behave the same wether it's being used by a client, running tests on a dev machine, or rending in the cloud.

Given a dehydrated state blob, Server-side rendering is as simple as
```js
function buildMarkupFromState(deHydratedState) {
  var state = State.createContext(<list of Store modules>, deHydratedState);
  return React.renderToString(React.createElement(MyAppComponent, {state: state}));
  state.end();
}
```

Mutating state based on an action is also bery simple, using the Flux Store paradigm.

```js
function getNewStateAfterAction(payload) {
  state.dispatch(payload);
  return state.dehydrate();
}
```
Creating new stores with new business logic is also simple

```js
var MyNewStore = State.createStore({
  storeName: "MyNewStore",
  handlers: {  //map payload.source constants to internal method names
    'VIEW': "handleViewPayload"
  },
  handleViewPayload: function(payload) {
    if (payload.action.type === "demo") {
      this.state[payload.action.data.id] = payload.action.data
    }
  },
  hydrate: function(state) {
    this.state = state;
  },
  dehydrate: function() {
    return this.state;
  }
}
```

Listening for state changes in components is also managed by the state object

```js
componentDidMount: function() {
  this.props.state.listenToStores(["MyNewStore"], this.handleEmit);
}
```
