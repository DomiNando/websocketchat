/*global jQuery, $, Handlebars, Stapes*/
'use strict';

var ChatView = Stapes.subclass({
  constructor: function () {
    this.bindEventHandlers();
    this.loadTemplates();
  }
});

ChatView.extend({
  ENTER_KEY: 13,
  message_template: '{{#messages}}<li class="{{class}} message"><div class="view"><div><label class="username">{{username}}</label><span>{{message}}</span></div></div></li>{{/messages}}'
});

ChatView.proto({
<<<<<<< HEAD
//Handles the events received
  bindEventHandlers: function () {
    console.log("Entro a Event Handlers!");

/*Handles the chat message input when receiving keystrokes from the user. It will send the message to the chat server on Enter key
if the message is not empty*/
=======
  bindEventHandlers: function () {
    console.log("Entro a Event Handlers!");

>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
    $('#input input').on('keyup', function (e) {
      console.log("Entro a keyup!!");
      var message = $.trim($(e.target).val().substr(0, 160));
      $('#input input').css("background-color", "white");

      if (e.which === ChatView.ENTER_KEY && message !== '') {
        e.preventDefault();
        this.emit('message-send', message);
        this.clearInput();
      }
    }.bind(this));

<<<<<<< HEAD
//When the minimize-chat button is clicked, it invokes the minimize() function
=======
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
    $('#minimize-chat').on('click', function () {
      this.minimize();
    }.bind(this));

<<<<<<< HEAD
//Not being used
=======
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
    $('#close-chat').on('click', function () {
      this.hideChat();
    }.bind(this));

<<<<<<< HEAD
//When the page changes, it sends a statechange event
=======
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
    window.onhashchange = function () {
      this.emit('statechange', this.getState());
    }.bind(this)
  },

<<<<<<< HEAD
//Loads the chat templates
=======
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
  loadTemplates: function () {
    console.log("Entro a loadTemplates!");
    this.template = Handlebars.compile(ChatView.message_template);
  },

<<<<<<< HEAD
//Scrolls the chat window content down when a new message is received, and adds messages to chat window html
=======
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
  render: function (messages) {
    var html = this.template({
      'messages': messages
    });
    $('#messages').html(html);

    // code to scroll the chat down on every new message or render.
    $('#content0').scrollTop($('#content0')[0].scrollHeight);
  },

<<<<<<< HEAD
//Shows all of the chat contents
=======
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
  show: function () {
    $('#chat').show();
    $('#content0').show();
    $('#input').show();
  },

<<<<<<< HEAD
//Not being used
=======
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
  hideChat: function () {
    $('#chat-window').hide();
  },

<<<<<<< HEAD
//Toggles the chat window size
=======
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
  minimize: function () {
    $('#chat #content0').toggle();
    $('#chat #input').toggle();
  },

<<<<<<< HEAD
//Clears the chat window content
=======
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
  clearInput: function () {
    $('#input input').val('');
  },

<<<<<<< HEAD
//Gets the state of the window
=======
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
  'getState': function () {
    console.log("Entro a getState!");
    return window.location.hash.replace('#/', '') || 'all';
  }
});