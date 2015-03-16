# state
Tying the loop of flux. Using a two way dispatcher that batches store change events for performance and simplicity


##Check out examples/apps/message App##

5 new messages should trigger 5 change events, no matter how many stores
are concerned. IE in a message app, updating the unread state shouldn't be
a seperate DOM update from adding the new message text


funciton a() {
  page.stores.login.validationError = ["passwordFalsy"];
  page.stores.login.emitChange();
  page.stores.login.validationError = ["emailFalsy"];
  page.stores.login.emitChange();
}
