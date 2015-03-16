# state
Tying the loop of flux. Using a two way dispatcher that batches store change events for performance and simplicity


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
  var state = State.createContext([], deHydratedState);
  return React.renderToString(React.createElement(MyAppComponent, {state: state}));
  state.end();
}
```
