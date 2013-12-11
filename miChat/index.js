/*global require, console,  process, __dirname, module, exports */

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
.
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

}

// Utilites
//Tests if something is a JSON
ChatServer.prototype.jsonTest = function (text) {
  try {
    JSON.parse(text);
  } catch (error) {
    return false;
  }

  return true;
};

//Creates the full date to be added to the messages
ChatServer.prototype.fullDate = function () {
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
};

//Returns the username of a user using the id
ChatServer.prototype.getNickname = function(id) {
  var nickname;
  Object.keys(this.users).forEach(function (value, index, array) {
    if (_self.users[value].id === id) {
      nickname = _self.users[value].username;
    }
  });
  return nickname || false;
};


//Sends an error JSON using the error code and error message
ChatServer.prototype.sendError = function(connection, code, message) {
  var mes = {
    "event": "error",
    "data": {
      "errorCode": code,
      "errMessage": message
    }
  };
  connection.write(JSON.stringify(mes));
};


//Gets the connection using a username
ChatServer.prototype.getConnection = function (destination) {
  for (var user in this.users) {
    if (this.users[user].id === destination) {
      return this.users[user].userconnection;
    }
  }
};

//Checks if an agent is available for a certain phone number
ChatServer.prototype.isSomeoneAvailable = function (number) {
  var _self = this;
  var bool;
  Object.keys(this.users).forEach(function (value, index, array1) {
    if (_self.users[value].phonenumber === number && _self.users[value].available) {
      bool = true;
    }
  });

  return bool || false;
};


//Returns a username using the phone number as input
ChatServer.prototype.getUserbyNumber = function (number) {
  var _self = this;
  var username;
  Object.keys(this.users).forEach(function (value, index, array1) {
    if (_self.users[value].phonenumber === number && _self.users[value].available === true) {
      username = _self.users[value].username;
    }
  });

  return username || false;
};

//Sends the message parameter to the connection object received as a parameter
ChatServer.prototype.sendMessage = function (connection, message) {
  var message = JSON.stringify(message);
  connection.write(message);
};


//Returns a username using the connection parameter
ChatServer.prototype.getUser = function (connection) {
  for (var user in this.users) {
    if (this.users[user].userconnection === connection) {
      console.log("[returning user] ", this.users[user].username);
      return this.users[user].username;
    }
  }

  return false;
};


//Sets the available property of the user who has the name matching the nickname parameter.
ChatServer.prototype.setAvailable = function (nickname) {

  if (this.users.hasOwnProperty(nickname)) {
    this.users[nickname].available = true;
    return true;
  } else {
    return false;
  }
};



// End Utlities



// Method to start the server. Must always be called or else
// nothing runs, ever!
ChatServer.prototype.start = function () {
  // start servers
  var _self = this;
  http_server.listen(this.port_number, function () {
    console.log('chat is listening on port', _self.port_number);
  });

//Handles the page connections
  this.chat_server.installHandlers(http_server, {
    prefix: this.prefix
  });

  main_server.use('/js', express.static(__dirname + '/js'));

//Listener for a connection being received
  this.chat_server.on('connection', function (connection) {
    console.log("[new connection]", connection.remoteAddress);
    console.log("[port] ", connection.remotePort);
    console.log(connection.remoteAddress + ":" + connection.remotePort);


//Listener for data being received
    connection.on('data', function (request) {
      _self.respond(connection, request);
    });

    // here we simply dereference the connection from the users list
    connection.on('close', function () {
      _self.close(connection);
    });
  });
};

// Method that handles message handling, between the client
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

//In the case that a message event is received... can send a message event back...
    case "message":
      if (data) {
        var fullDate = this.fullDate();

        // If the boolean data.disconnected is true, then set the response message to
        // 'has disconnected', to let the other user know that 
        var responseMessage = data.disconnected ? 'has disconnected' : data.message;
        responseMessage += " " + fullDate;
        var destination = data.destinationId;

        console.log('[message to]', destination);
        console.log(responseMessage);

        var conn = this.getConnection(destination);

        var connectedUser = this.getUser(connection);
        clearTimeout(this.users[connectedUser].heartbeat);
        this.users[connectedUser].heartbeat = setTimeout(function () {
          if (_self.users[connectedUser] !== undefined) {
            if (!isNaN(parseInt(_self.users[connectedUser].username, 10))) {
              var connecti = _self.users[connectedUser].userconnection;
              var rls = {
                "event": "message",
                "data": {
                  "message": "You have been disconnected, please try again",
                  "username": "server"
                }
              };
              try {
                connecti.write(JSON.stringify(rls));
              } catch (e) {
                console.log('[fail]');
              }
              _self.setAvailable(_self.users[connectedUser].chatingWith);
              delete _self.users[connectedUser];
            }
          }
          
        }, 40000);

        var rs = {
          "event": "message",
          "data": {
            "message": responseMessage,
            "username": this.getUser(connection)
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


//In the case a requestChat event is received... can send a request ok event...
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

        var connectedUser = this.getUser(connection);
        this.users[connectedUser].chatingWith = dest;
        this.users[connectedUser].heartbeat = setTimeout(function () {
          if (!isNaN(parseInt(_self.users[connectedUser].username, 10))) {
            var connecti = _self.users[connectedUser].userconnection;
            var rs = {
              "event": "message",
              "data": {
                "message": "You have been disconnected, please try again",
                "username": "server"
              }
            };
            try {
              connecti.write(JSON.stringify(rs));
            } catch (e) {
              console.log('[fail]');
            }
            _self.setAvailable(_self.users[connectedUser].chatingWith);
            delete _self.users[user];
          }
        }, 30000);

        this.sendMessage(connection, rspv);
      } else {

        this.sendError(connection, 400, "Server couldn't process request");
      }
      break;


//In the case a new chat event is received... can send a new chat event, or a no users event...
    case "new chat":

      if (data.number !== undefined) {
        if (this.isSomeoneAvailable(data.number)) {
          var username = this.getUserbyNumber(data.number);
          var user = this.users[username];
          var message = {
            "event": "user_ready",
            "data": {
              "user": username
            }
          };


          this.sendMessage(this.users[username].userconnection, {
            "event": "new chat",
            "data": {
              "destination": this.getUser(connection)
            }
          });

          this.users[username].available = false;
          this.sendMessage(connection, message);
        } else {
          this.sendMessage(connection, {
            "event": "no_users"
          });
        }
      } else {
        this.sendError(connection, 406, "[please input a number.]");
      }

      break;

//In the case a login event is received... can send a user ok event...
    case 'login':
      // check if this user was loged in before
      var user = data.nickname || data.phonenumber;

      console.log('[now using connection with ip ] ' +
        connection.remoteAddress +
        ' [at port] ' +
        connection.remotePort);
      if (user !== undefined) {
        if (this.users[user]) {
          console.log('[login user]');
          clearTimeout(this.userTimeouts[user]);
          this.users[user].userconnection = connection;
          console.log(
            '[the connection object is]',
            this.users[user].userconnection.toString()
          );
        } else {
          // let's register this guy!
          console.log('[adding user]');
          this.users[user] = {
            userconnection: connection,
            id: user + "" + connection.remotePort,
            username: user,
            phonenumber: data.phonenumber,
            available: true,
            chatingWith: null,
            heartbeat: null
          };

          console.log('[the connection object is]', this.users[user].userconnection.toString());
        }

        this.sendMessage(connection, {
          "event": "user ok"
        });

      } else {
        this.sendError(connection, 406, "malformated");
      }
      break;

//In the case a set available event is received...
    case 'set available':
      /*user = data.nickname;
        this.users[user].available = true;*/
        var nickname;

        Object.keys(this.users).forEach(function (value, index, array) {
          if (_self.users[value].id === data.destinationId) {
            nickname = _self.users[value].username;
          }
        });

        this.setAvailable(nickname);
      break;


//In the case a web disconnected event is received...
      case 'web disconnected':
        var destinysChild = data.destination;
        if (destinysChild) {
          var enlace = this.getConnection(destinysChild);
          var serverSaysZis = { "event": "web disconnect", "data": null };

          try {
            this.sendMessage(enlace, serverSaysZis);
          } catch (e) {
            enlace.write(JSON.stringify(serverSaysZis));
          }
        }
        break;
      default:
      this.sendError(connection, 400, "Server couldn't process request");
      break;

    }

  }
};


//Handles the close event
ChatServer.prototype.close = function (connection) {
  var _self = this;
  console.log("[closed connection] ", connection.remoteAddress + ":" + connection.remotePort);
  // console.log("users", users); // uncomment for debuging

  
  for (var user in this.users) {
    console.log("current user is: ", this.users[user].id);
    var userconnection = this.users[user].userconnection;

    if (connection === userconnection) {
      console.log("[user deleted] ", this.users[user].id);
      this.userTimeouts[this.users[user].username] = setTimeout(function () {
        console.log('[user really deleted!]');
        delete _self.users[user];
      }, 30000);

    } else {
      console.log("[no user deleted]");
    }

  }
};

module.exports = exports = ChatServer;