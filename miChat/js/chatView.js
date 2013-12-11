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
//Handles the events received
  bindEventHandlers: function () {
    console.log("Entro a Event Handlers!");

/*Handles the chat message input when receiving keystrokes from the user. It will send the message to the chat server on Enter key
if the message is not empty*/
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

//When the minimize-chat button is clicked, it invokes the minimize() function
    $('#minimize-chat').on('click', function () {
      this.minimize();
    }.bind(this));

//Not being used
    $('#close-chat').on('click', function () {
      this.hideChat();
    }.bind(this));

//When the page changes, it sends a statechange event
    window.onhashchange = function () {
      this.emit('statechange', this.getState());
    }.bind(this)
  },

//Loads the chat templates
  loadTemplates: function () {
    console.log("Entro a loadTemplates!");
    this.template = Handlebars.compile(ChatView.message_template);
  },

//Scrolls the chat window content down when a new message is received, and adds messages to chat window html
  render: function (messages) {
    var html = this.template({
      'messages': messages
    });
    $('#messages').html(html);

    // code to scroll the chat down on every new message or render.
    $('#content0').scrollTop($('#content0')[0].scrollHeight);
  },

//Shows all of the chat contents
  show: function () {
    $('#chat').show();
    $('#content0').show();
    $('#input').show();
  },

//Not being used
  hideChat: function () {
    $('#chat-window').hide();
  },

//Toggles the chat window size
  minimize: function () {
    $('#chat #content0').toggle();
    $('#chat #input').toggle();
  },

//Clears the chat window content
  clearInput: function () {
    $('#input input').val('');
  },

//Gets the state of the window
  'getState': function () {
    console.log("Entro a getState!");
    return window.location.hash.replace('#/', '') || 'all';
  }
});