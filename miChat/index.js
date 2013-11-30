/*global require, console,  process, __dirname, module, exports */
// Include libraries need to run the chat server.
var express = require('express');
var chat_http = require('http');
var main_server = express();
var sockjs = require("sockjs");
var http_server = chat_http.createServer(main_server);

// This is a configuration variable.
var sockjs_opts = {
  sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js"
};

// This is the constructor for the ChatServer class.
// Notice constructors start with upper-case letters; methods
// start with lower-case.
function ChatServer(chat_port, chat_prefix) {
  // we're in strict mode here. If this fails, everything
  // fails.
  'use strict';

  // This is the users 'list' object and the
  // user timeouts array.
  this.users = {};
  this.userTimeouts = [];

  // setup the server
  this.chat_server = sockjs.createServer(sockjs_opts);
  this.port_number = chat_port || process.env.PORT || 3500;
  this.prefix = chat_prefix || '/chat';

  //ity
}

//ites
ChatServer.prototype = {
  // function to test if a string converts to valid JSON.
  jsonTest: function (text) {
    try {
      JSON.parse(text);
    } catch (error) {
      return false;
    }

    return true;
  },

  sendError: function (connection, code, message) {
    var mes = {
      "event": "error",
      "data": {
        "errorCode": code,
        "errMessage": message
      }
    };
    connection.write(JSON.stringify(mes));
  },

  getConnection: function (destination) {
    for (var user in this.users) {
      if (this.users[user].id === destination) {
        return this.users[user].userconnection;
      }
    }
  },

  // method to return list of users based on their phone numbers
  getUsersFromNumber: function (number) {
    var current_user;

    for (var user in this.users) {
      current_user = this.users[user];

      if (current_user.phonenumber === number && current_user.available) {
        return current_user.userName; // if we find a match let's return it
      }
    }

    // if no users were found return false
    return false;

    /*console.log(users_that_match.toString());
    return users_that_match;*/
  },

  sendMessage: function (connection, message) {
    var message = JSON.stringify(message);
    connection.write(message);
  },

  getUser: function (connection) {
    var _self = this;
    var u;
    // for (var user in this.users) {
    //   if (this.users[user].userconnection == connection) {
    //     console.log("[returning user] ", this.users[user].userName);
    //     return this.users[user].userName;
    //   }
    // }

    Object.keys(this.users).forEach(function (user, userIndex, usersArray) {
      if (_self.users[user].userconnection === connection) {
        u = _self.users[user].userName;
      }
    });

    return u || false;
  },

  fullDate: function () {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var hr = today.getHours();
    var mins = today.getMinutes();
    var secs = today.getSeconds();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    today = mm + '/' + dd + '/' + yyyy;
    return "at " + dd + "/" + mm + "/" + yyyy + " " + hr + ":" + mins + ":" + secs;
  },

  setAvailable: function (nickname) {
    var bool, _self = this;
    // for (var user in this.users) {
    //   var current_user = this.users[user];

    //   if (current_user.userName === nickname) {
    //     current_user.available = true;
    //     return true;
    //   }
    // }
    
    Object.keys(this.users).forEach(function (user, userIndex, usersArray) {
      if (_self.users[user].userName === nickname) {
        _self.users[user].available = true;
        bool = true;
      } else {
        bool =  false;
      }
    });

    return bool;
  }
};

// Method to start the server. Must always be called or else
// nothing runs, ever!
ChatServer.prototype.start = function () {
  // start servers
  var _self = this;
  http_server.listen(this.port_number, function () {
    console.log('chat is listening on port', _self.port_number);
  });

  this.chat_server.installHandlers(http_server, {
    prefix: this.prefix
  });

  main_server.use('/js', express.static(__dirname + '/js'));

  this.chat_server.on('connection', function (connection) {
    console.log("[new connection]", connection.remoteAddress);
    console.log("[port] ", connection.remotePort);
    console.log(connection.remoteAddress + ":" + connection.remotePort);

    connection.on('data', function (request) {
      _self.respond(connection, request);
    });

    // here we simply dereference the connection from the users list
    connection.on('close', function () {
      _self.close(connection);
    });
  });
};

// Method that handles message handleing, between the client
// and the server.
ChatServer.prototype.respond = function (connection, request, users) {
  // let's make sure the request is not empty or not valid json
  var _self = this;

  if (request === null || !this.jsonTest(request)) {

    console.log(request + " from " +
      connection.remoteAddress +
      ":" +
      connection.remotePort);

    this.sendError(connection, 400, "Server couldn't process request");

  } else {

    // now that we know the request is valid json, let's parse it
    // and react to the events
    var e = JSON.parse(request);
    var eventType = e.event;
    var data = e.data;
    console.log("[event]", eventType);

    switch (eventType) {

    case "message":
      if (data) {
        var fullDate = this.fullDate();

        // If the boolean data.disconnected is true, then set the response message to
        // 'has disconnected', to let the other user know that 
        var responseMessage = data.disconnected ? 'has disconnected' : data.message;
        responseMessage += " " + fullDate;
        var destination = data.destinationId;

        console.log(responseMessage);

        var conn = this.getConnection(destination);


        // for (var user in this.users) {
        //   if (this.users[user].id === destination) {
        //     console.log(this.users[user]);
        //     this.users[user].available = data.disconnected || false;
        //   }
        // }
        
        Object.keys(this.users).forEach(function(user, user_index, users_array) {        
          if (_self.users[user].id === destination) {
            console.log('[much user]', _self.users[user].id);
            _self.users[user].available = data.disconnected || false;
          }
        });

        var rs = {
          "event": "message",
          "data": {
            "message": responseMessage,
            "userName": this.getUser(connection) //,
            // "be_availabe": data.disconnected
          }
        };

        if (conn) { // if there is a connection, send the response.
          conn.write(JSON.stringify(rs));
        } else {
          this.sendError(connection, 406, "Found no destination to send");
        }

      } else {
        this.sendError(connection, 406, "Found no message to send");
      }
      break;

    case "requestChat":
      var dest = data.destination;
      console.log("[to] ", dest);
      if (this.users[dest] && this.users[dest].userconnection === connection) {
        this.sendError(connection, 406, "can't send message to yourself.");
        console.log("[self chat attempt]");
      } else if (this.users[dest]) {

        var destino = this.users[dest];

        console.log("[connecting to] ", destino);
        var rspv = {
          "event": "request ok",
          "data": {
            "userId": destino.id
          }
        };

        this.sendMessage(connection, rspv);

        if (data.newChat) { // this is a special condition sent by a mobile
          var name = this.getUser(connection);

          console.log("[user connection] ", name);
          var message = {
            "event": "new chat",
            "data": {
              "destination": name
            }
          };

          var conexion = destino.userconnection;
          destino.available = false; // this users i now occupied
          this.sendMessage(conexion, message);
        }
      } else {
        this.sendError(connection, 400, "Server couldn't process request");
      }
      break;

    case "login":
      // check if this user was loged in before
      var user = data.nickname || data.phonenumber;

      console.log('[now using connection with ip ] ' + 
        connection.remoteAddress + 
        ' [at port] ' + 
        connection.remotePort);
      if (user) {
        if (this.users[user]) {
          console.log('[login user]');
          clearTimeout(_self.userTimeouts[user]);
          this.users[user].userconnection = connection;
          console.log('[the connection object is]', this.users[user].userconnection.toString());
          this.users[user].available = data.available; // this is a boolean!
        } else {
          // let's register this guy!
          console.log('[adding user]');
          this.users[user] = {
            userconnection: connection,
            id: user + "" + connection.remotePort,
            userName: user, // This might be causing problems.
            phonenumber: data.phonenumber,
            available: true
          };

          console.log('[the connection object is]', this.users[user].userconnection.toString());
        }
         
        // console.log('[adding/login]')
        // this.users[user] = {
        //   userconnection: connection,
        //   id: user + "" + connection.remotePort,
        //   userName: user,
        //   phoneNumber: data.phonenumber,
        //   available: data.available || true
        // };


        this.sendMessage(connection, {
          "event": "user ok"
        });

      } else {
        this.sendError(connection, 406, "malformated");
      }
      break;

    case 'get users':
      var number = data.number;
      console.log('[number request]', number);
      var user = this.getUsersFromNumber(number);
      console.log('[user is]', user);
      var response_message = {};

      setTimeout(function () {
        if (user) {
          response_message = {
            "event": "user_ready",
            "data": {
              "user": user
            }
          };
        } else {
          response_message = {
            "event": "no_users"
          };
        }

        _self.sendMessage(connection, response_message);
      }, 3000);
      break;

    case 'set available':
      /*user = data.nickname;
     this.users[user].available = true;*/
      var nickname = data.nickname;

      this.setAvailable(nickname);


      break;

    default:
      this.sendError(connection, 400, "Server couldn't process request");
      break;

    }
  }
};

ChatServer.prototype.close = function (connection) {
  var _self = this;
  console.log("[closed connection] ", connection.remoteAddress + ":" + connection.remotePort);
  // console.log("users", users); // uncomment for debuging

  // we need to find a way to eliminates this for loop.
  // It might be taking too much time!
  // I think there might be a method to find an object within
  // another object. Without using for each loops.
  for (var user in this.users) {
    console.log("current user is: ", this.users[user].id);
    var userConnection = this.users[user].userconnection;

    if (connection === userConnection) {
      console.log("[user deleted] ", this.users[user].id);
      this.userTimeouts[this.users[user].userName] = setTimeout(function () {
        console.log('[user really deleted!]');
        delete _self.users[user];
      },30000);

    } else {
      console.log("[no user deleted]");
    }

  }
};

module.exports = exports = ChatServer;