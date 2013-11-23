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

        $('#submit').on('click',function(e) {
            var message = $('#input input').val();

            console.log('length is ' + message.length);
            if (message.length <= 160 && message !== '') {
                this.emit('message-send', message);
                this.clearInput();
            }
        }.bind(this));

        $('#input input').on('keyup', function(e) {
            var message = $.trim($(e.target).val());
             $('#input input').css("background-color", "white");

            if (e.which === ChatView.ENTER_KEY && message !== '' && message.length <= 160) {
                e.preventDefault();
                this.emit('message-send', message);
                this.clearInput();
            } else if (message.length > 160) {
                $('#input input').css("background-color", "red");
            }
        }.bind(this));

        $('#minimize-chat').on('click', function() {
            this.minimize();
        }.bind(this));

        $('#close-chat').on('click', function() {
            this.hide();
        }.bind(this));

        window.onhashchange = function() {
            this.emit('statechange', this.getState());
        }.bind(this)
    },

    loadTemplates: function() {
        this.template = Handlebars.compile(ChatView.message_template);
    },

    render: function(messages) {
        var html = this.template({ 'messages' : messages });
        $('#messages').html(html);
    },

    show: function() {
        $('#chat').show();
        $('#content').show();
        $('#input').show();
    },

    hide: function() {
        $('#chat-window').hide();
    },

    minimize: function() {
        $('#chat #content').toggle();
        $('#chat #input').toggle();
    },

    clearInput: function() {
        $('#input input').val('');
    },

    'getState': function() {
        return window.location.hash.replace('#/', '') || 'all';
    },

    'setActiveRoute': function(route) {
        $('#filters a').removeClass('selected').filter('[href="#/' + route + '"]').addClass('selected');
    }
});