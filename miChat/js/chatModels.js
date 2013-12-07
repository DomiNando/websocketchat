/*global SockJS, Stapes*/
'use strict';

var _db = window.sessionStorage;
// _db.setItem('current_id', ''); // problem!!! this is reseting the ide everytime we change the page!!!\

if (_db.current_id === null || _db.current_id === undefined) {
  _db.setItem('current_id', '');
}

var ChatModel = Stapes.subclass({
  constructor: function (server, options, messages) {
    this.set(messages);
    this.server = new SockJS(server, null, options);
    this.onOpen();
    this.onMessage();
    this.server.onclose = this.onClose();

    this.available = true;
    this.destinationId = undefined;
  },

  setDestinationId: function (id) {
    if (id) {
      this.destinationId = id;
      _db.setItem('current_id', id);
    } else {
      return this.destinationId || _db.getItem('current_id');
    }
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
    var _self = this;
    this.server.onopen = function () {
      _self.emit('open');
    };
  },
  onMessage: function () {
    var _self = this;
    this.server.onmessage = function (response) {

      if (typeof response === 'object') {
        var e = JSON.parse(response.data);
        var event = e.event;
        var data = e.data;

        switch (event) {
        case 'user ok':
          _self.emit('user ok');
          break;
        case "request ok":
          _self.setDestinationId(data.userId);
          _self.emit('request ok');
          break;

        case "message":
          var chatMessage = data.message;
          var userName = data.username;
          var dt = {
            'message': chatMessage,
            'user': userName,
            'class': "external"
          };

          // if (data.be_available) {
          //   _self.sendData({
          //     "event": "set available",
          //     "data": {
          //       "nickname": this.nickname
          //     }
          //   });

          //   this.available = true;
          // } else {
          //   this.available = false;
          // }

          console.log('data', dt);
          _self.emit('new message', dt);
          _self.addMessage(dt);
          
          break;
        case "error":
          var code = data.errorCode;
          var errorMessage = data.errMessage;
          _self.emit('error', {
            code: code,
            message: errorMessage
          });
          break;
        case "new chat":
          var destination = data.destination;
          var datum = {
            "event": "requestChat",
            "data": {
              "destination": destination
            }
          };

          _self.sendData(datum);
          break;
        default:
          _self.emit('sosumi');
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
    this.sendData({
      "event": "web disconnected",
      "data": {
        "destination": this.destinationId
      }
    });
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
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var hr = today.getHours();
    var mins = today.getMinutes();
    var secs = today.getSeconds();
    if (dd < 10) {
      dd = '0' + dd
    } 
    if (mm < 10) {
      mm = '0' + mm
    }
    today = mm + '/' + dd + '/' + yyyy;
    var fullDate = "at " + dd + "/" + mm + "/" + yyyy + " " + hr + ":" + mins + ":" + secs;
    var data = {
      'event': 'message',
      'data': {
        'message': message ,
        'destinationId': _db.getItem('current_id')
      }
    };

    this.sendData(data);

    var info = {
      'user': this.username,
      'message': message + ' ' + fullDate,
      'class': 'own'
    };

    this.addMessage(info);
  },

  handle: function (response) {
    this.onMessage(response);
  }
});