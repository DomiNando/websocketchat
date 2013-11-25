/*global SockJS, Stapes*/
'use strict';

var _db = window.localStorage;

var ChatModel = Stapes.subclass({
  setDestinationId: function (id) {
    if (id) {
      this.destinationId = id;
      _db.setItem('current_id', id);
    } else {
      return this.destinationId || _db.getItem('current_id');
    }
  },

  constructor: function (server, options, messages) {
    this.set(messages);
    this.server = new SockJS(server, null, options);
    this.onOpen();
    this.onMessage();
    this.server.onclose = this.onClose();

    this.available = true;
  },

  login: function (phoneNumber, userName) { //CAMBIE!!
    this.username = 'Me';
    this.phoneNumber = phoneNumber || null;
    this.nickname = userName; //CAMBIE!!!

    var data = {
      'event': 'login',
      'data': {
        'phonenumber': this.phoneNumber,
        'nickname': this.nickname, //CAMBIE!!,
        'available': this.available
      }
    };

    this.sendData(data);

  },

  onOpen: function () {
    console.log('[open]');
    var model = this;
    this.server.onopen = function () {
      model.emit('open');
    };
  },

  onMessage: function () {
    var model = this;
    this.server.onmessage = function (response) {

      if (typeof response === 'object') {
        var e = JSON.parse(response.data);
        var event = e.event;
        var data = e.data;

        switch (event) {
        case 'user ok':
          model.emit('user ok');
          break;
        case "request ok":
          model.setDestinationId(data.userId);
          model.emit('request ok');
          break;

        case "message":
          var chatMessage = data.message;
          var userName = data.userName;
          var dt = {
            'message': chatMessage,
            'user': userName,
            'class': "external"
          };

          if (data.be_available) {
            model.sendData({
              "event": "set available",
              "data": {
                "nickname": this.nickname
              }
            });

            this.available = true;
          } else {
            this.available = false;
          }

          console.log('data', dt);
          model.emit('new message', dt);
          model.addMessage(dt);
          break;
        case "error":
          var code = data.errorCode;
          var errorMessage = data.errMessage;
          model.emit('error', {
            code: code,
            message: errorMessage
          });
          break;
        case "new chat":
          var destination = data.destination;
          var dt = {
            "event": "requestChat",
            "data": {
              "destination": destination
            }
          };

          model.sendData(dt);
          break;
        default:
          model.emit('sosumi');
          break;
        }
      }
    };
  },

  onClose: function () {
    this.emit('close');
  },

  sendData: function (data) {
    console.log('calling server');
    this.server.send(JSON.stringify(data));
  },

  close: function () {
    this.server.close();
  },

  addMessage: function (data) {
    this.push({
      'username': data.user,
      'message': data.message,
      'date': new Date(),
      'class': data.class
    });
  },

  removeOld: function () {
    var now = new Date();
    var max_days = 432000000;

    this.remove(function (message) {
      return Math.abs(now - message.date) > max_days ? message : null;
    });
  },

  getMessages: function () {
    // Let's just return all the messages in the stack
    return this.filter(function (message) {
      console.log('rendering');
      return message;
    });
  },

  sendMessage: function (message) {
    var data = {
      'event': 'message',
      'data': {
        'message': message,
        'destinationId': _db.getItem('current_id')
      }
    };



    this.sendData(data);

    var info = {
      'user': this.username,
      'message': message,
      'class': 'own'
    };

    this.addMessage(info);
  },

  handle: function (response) {
    this.onMessage(response);
  }
});