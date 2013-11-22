/*global ChatView, ChatModel, ChatStore */
'use strict';

// .bind shim for IE8
if (!Function.prototype.bind) {
    Function.prototype.bind = function(context) {
        var self = this;
        return function() {
            return self.apply(context, arguments);
        };
    };
}

var ChatController  = Stapes.subclass({
    constructor: function(server, options) {
        this.view = new ChatView();
        this.store = new ChatStore();
        this.model = new ChatModel(server, options, this.store.load());

        this.bindEventHandlers();

        // get initial state from view.
        this.set('state', this.view.getState());
    },

    bindEventHandlers: function() {

        this.on({
            'change:state': function(state) {
                this.view.setActiveRoute(state);
                this.renderAll();
            }
        });

        // set model events listener
        this.model.on({
            'change': function() {
                this.renderAll();
            },

            'close': function() {
                this.model.server.close();
            },

            'error': function(err) {
                console.log('[' + err.code + '] ' + err.message);
            },

            'sosumi': function() {
                console.log('Sorry Nayda');
            },

            'request ok': function() {
                this.view.show();
            },

            'open': function() { //CAMBIE!!!!
            	this.model.login(this.phoneNumber, this.username); //cambie!!
                //this.model.login(1234567890);
            },

            'new message': function() {
                this.renderAll();
                console.log('new!');
            }
        }, this);

        // set view events listenert
        this.view.on({
            'message-send': function(message) {
                this.model.sendMessage(message);
            },

            'statechange': function(state) {
                this.set('state', state);
            }
        }, this);

    },

    renderAll: function() {
        this.store.save(this.model.getMessages());
        this.view.render(this.model.getMessages());

        if (this.model.size() > 0) {
            this.view.show();
        } else {
            this.view.hide();
        }
    },
    
    setUserNameAndPhoneNumber: function(username, phonenumber) {
    	this.username = username;
    	this.phonenumber = phonenumber;
    
    }
});