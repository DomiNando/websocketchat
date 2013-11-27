/*global jQuery, $, Handlebars */
'use strict';

var ChatView = Stapes.subclass({
    constructor: function() {
        this.bindEventHandlers();
        this.loadTemplates();
    }
});

ChatView.extend({
    ENTER_KEY: 13,
    message_template: '{{#messages}}<li class="{{class}} message"><div class="view"><div><label class="username">{{username}}</label><span>{{message}}</span></div></div></li>{{/messages}}'
});

ChatView.proto({
    bindEventHandlers: function() {
        console.log("Entro a Event Handlers!");

        $('#input input').on('keyup', function(e) {
        	console.log("Entro a keyup!!");
            var message = $.trim($(e.target).val());
             $('#input input').css("background-color", "white");

            if (e.which === ChatView.ENTER_KEY && message !== '') {
                e.preventDefault();
                this.emit('message-send', message);
                this.clearInput();
            }
        }.bind(this));

        $('#minimize-chat').on('click', function() {
            this.minimize();
        }.bind(this));

        $('#close-chat').on('click', function() {
            this.hideChat();
        }.bind(this));

        window.onhashchange = function() {
            this.emit('statechange', this.getState());
        }.bind(this)
    },

    loadTemplates: function() {
    console.log("Entro a loadTemplates!");
        this.template = Handlebars.compile(ChatView.message_template);
    },

    render: function(messages) {
        var html = this.template({ 'messages' : messages });
        $('#messages').html(html);
    },

    show: function() {
        $('#chat').show();
        $('#content0').show();
        $('#input').show();
    },

    hideChat: function() {
        $('#chat-window').hide();
    },

    minimize: function() {
        $('#chat #content0').toggle();
        $('#chat #input').toggle();
    },

    clearInput: function() {
        $('#input input').val('');
    },

    'getState': function() {
    console.log("Entro a getState!");
        return window.location.hash.replace('#/', '') || 'all';
    }
});