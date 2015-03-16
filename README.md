# state
Tying the loop of flux. Using a two way dispatcher that batches store change events for performance and simplicity


## Batches change events by dispatch loops ##

5 new messages should trigger 5 change events, no matter how many stores
are concerned. IE in a message app, updating the unread state shouldn't be
a seperate DOM update from adding the new message text

## Composes dehydrated states ##

Add `hydrate()` and `dehydrate()` functions to your stores, and state will compose JSON blobs which can be used to rehydrate your app back to a previous state. Very usefull for integration testing and server-side rendering.
