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


var ChatController = Stapes.subclass({
  constructor: function (server, options) {
    this.view = new ChatView();
    this.store = new ChatStore();
    this.model = new ChatModel(server, options, this.store.load());

    this.bindEventHandlers();

    // get initial state from view.
    this.set('state', this.view.getState());
  },


//Handles events
  bindEventHandlers: function () {

//Handles a change:state event, by rendering the message
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

//Handles a close event by closing the server
      'close': function () {
        this.model.server.close();
      },

//Handles an erroe event by sending an error message with a code
      'error': function (err) {
        console.log('[' + err.code + '] ' + err.message);
      },

//Easter Egg event that will never happen
      'sosumi': function () {
        console.log('Sorry Nayda');
      },

//Handles a request ok event, by showing the chat window being functional
      'request ok': function () {
        this.view.show();
      },

//Handles an open event, by setting the sessionStorage, username, and phonenumber
      'open': function () { //CAMBIE!!!!
        // this.model.login(this.phoneNumber, this.username); //cambie!!
        var sstore = window.sessionStorage;
        var username = sstore.getItem("username");
        var phonenumber = sstore.getItem("agencyPhoneNumber");
        this.model.login(phonenumber, username);
      },

//Handles a new message event by rendering all messages in the stack
      'new message': function () {
        this.renderAll();
        console.log('new!');
      }
    }, this);

    // set view events listener
    this.view.on({
//Handles a message-send event by sending a message
      'message-send': function (message) {
        this.model.sendMessage(message);
      },

//Handles a statechange event by setting the state to the parameter
      'statechange': function (state) {
        this.set('state', state);
      }
    }, this);

  },

//Renders the messages and scrolls down the message window when a new message is received
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

//Sets the username and phone number of a user to the parameters
  setUserNameAndPhoneNumber: function (username, phonenumber) {
    this.username = username;
    this.phonenumber = phonenumber;

  }
});