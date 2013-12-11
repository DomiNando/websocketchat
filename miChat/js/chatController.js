/*global ChatView, ChatModel, ChatStore, Stapes, $ */
'use strict';

// .bind shim for IE8
if (!Function.prototype.bind) {
  Function.prototype.bind = function (context) {
    var self = this;
    return function () {
      return self.apply(context, arguments);
    };
  };
}

<<<<<<< HEAD

=======
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
var ChatController = Stapes.subclass({
  constructor: function (server, options) {
    this.view = new ChatView();
    this.store = new ChatStore();
    this.model = new ChatModel(server, options, this.store.load());

    this.bindEventHandlers();

    // get initial state from view.
    this.set('state', this.view.getState());
  },

<<<<<<< HEAD

//Handles events
  bindEventHandlers: function () {

//Handles a change:state event, by rendering the message
=======
  bindEventHandlers: function () {

>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
    this.on({
      'change:state': function (state) {
        this.renderAll();
      }
    });

    // set model events listener
    this.model.on({
      'change': function () {
        this.renderAll();
      },

<<<<<<< HEAD
//Handles a close event by closing the server
=======
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
      'close': function () {
        this.model.server.close();
      },

<<<<<<< HEAD
//Handles an erroe event by sending an error message with a code
=======
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
      'error': function (err) {
        console.log('[' + err.code + '] ' + err.message);
      },

<<<<<<< HEAD
//Easter Egg event that will never happen
=======
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
      'sosumi': function () {
        console.log('Sorry Nayda');
      },

<<<<<<< HEAD
//Handles a request ok event, by showing the chat window being functional
=======
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
      'request ok': function () {
        this.view.show();
      },

<<<<<<< HEAD
//Handles an open event, by setting the sessionStorage, username, and phonenumber
=======
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
      'open': function () { //CAMBIE!!!!
        // this.model.login(this.phoneNumber, this.username); //cambie!!
        var sstore = window.sessionStorage;
        var username = sstore.getItem("username");
        var phonenumber = sstore.getItem("agencyPhoneNumber");
        this.model.login(phonenumber, username);
      },

<<<<<<< HEAD
//Handles a new message event by rendering all messages in the stack
=======
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
      'new message': function () {
        this.renderAll();
        console.log('new!');
      }
    }, this);

<<<<<<< HEAD
    // set view events listener
    this.view.on({
//Handles a message-send event by sending a message
=======
    // set view events listenert
    this.view.on({
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
      'message-send': function (message) {
        this.model.sendMessage(message);
      },

<<<<<<< HEAD
//Handles a statechange event by setting the state to the parameter
=======
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
      'statechange': function (state) {
        this.set('state', state);
      }
    }, this);

  },

<<<<<<< HEAD
//Renders the messages and scrolls down the message window when a new message is received
=======
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
  renderAll: function () {
    this.store.save(this.model.getMessages());
    this.view.render(this.model.getMessages());
    $('#messages').scrollTop($('#messages')[0].scrollHeight);

    if (this.model.size() > 0) {
      this.view.show();
    } else {
      this.view.hideChat();
    }
  },

<<<<<<< HEAD
//Sets the username and phone number of a user to the parameters
=======
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
  setUserNameAndPhoneNumber: function (username, phonenumber) {
    this.username = username;
    this.phonenumber = phonenumber;

  }
});