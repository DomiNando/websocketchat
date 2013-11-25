/*global require, console */
function ChatServer(chat_port, chat_prefix) {
  'use strict';

  // include required libraries
  var express = require('express');
  var chat_http = require('http');
  var main_server = express();
  var sockjs = require("sockjs");
  var http_server = chat_http.createServer(main_server);
  var sockjs_opts = {
    sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js"
  };
  var chat_server = sockjs.createServer(sockjs_opts);

  // setup variables
  var _self = this;
  var port_number = chat_port || process.env.PORT || 3500;
  var prefix = chat_prefix || '/chat';

  // main chat code is here
  var users = {};
  var user_timeouts = [];

  var util = {
    jsonTest: function (text) { // function to test if a string converts to valid JSON.

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
      for (var user in users) {
        if (users[user].id === destination) {
          return users[user].userconnection;
        }
      }
    },

    // method to return list of users based on their phone numbers
    getUsersFromNumber: function (number) {
      // var users_that_match = [];
      /*for (var number in list_of_numbers) {
        for (var user in users) {
          var current_user = users[user];

          if (current_user.phonenumber === number && current_user.available) {
            users_that_match.push(current_user.id); // instead do a return
          }
        }
      }*/

      /*var userId;
      Object.keys(users).forEach(function (user) {
        if (user.phonenumber == number && user.available) {
          userId = user.id;
        }
      });*/
      
      var current_user;

      for (var user in users) {
        current_user = users[user];

        console.log('[current user in list]', current_user.userName);
        console.log('[available]', current_user.available);
        console.log('[phonenumber]', current_user.phonenumber);
        console.log('[number is]', number);
        console.log('[phonenumber test]', current_user.phonenumber === number);
        if (current_user.phonenumber === number && current_user.available) {
          console.log('[breaking out]');
          return current_user.userName;    // if we find a match let's return it
        }
      }

      // if no users were found return false
      return false;

      /*console.log(users_that_match.toString());
      return users_that_match;*/
    },

    sendMessage: function (connection, message) {
      connection.write(JSON.stringify(message));
    },

    getUser: function (connection) {
      for (var user in users) {
        if (users[user].userconnection == connection) {
          console.log("[returning user] ", users[user].userName);
          return users[user].userName;
        }
      }

      return false;
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

    setAvailable: function(nickname) {
      for (var user in users) {
        var current_user = users[user];

        if (current_user.userName === nickname) {
          current_user.available = true;
          return true;
        }
      }
    }
  };

  this.start = function () {
    // start servers
    http_server.listen(port_number, function () {
      console.log('chat is listening on port', port_number);
    });

    chat_server.installHandlers(http_server, {
      prefix: prefix
    });

    main_server.use('/js', express.static(__dirname + '/js'));

    chat_server.on('connection', function (connection) {
      console.log("[new connection]", connection.remoteAddress);
      console.log("[port] ", connection.remotePort);
      console.log(connection.remoteAddress + ":" + connection.remotePort);

      connection.on('data', function (request) {
        _self.respond(connection, request, users);
      });

      // here we simply dereference the connection from the users list
      connection.on('close', function () {
        _self.close(connection);
      });
    });
  };

  this.respond = function (connection, request, users) {
    // let's make sure the request is not empty or not valid json
    if (request === null || !util.jsonTest(request)) {
      console.log(request + " from " + connection.remoteAddress + ":" + connection.remotePort);
      ChatServer.util.sendError(connection, 400, "Server couldn't process request");
    } else {
      // now that we know the request is valid json, let's parse it
      // and react to the events
      var e = JSON.parse(request);
      var eventType = e.event;
      var data = e.data;
      console.log("[event]", eventType);

      switch (eventType) {

        /* case "new user": // new user is depreceated, don't use.
        if (data.phoneNumber) {
          data.userName = data.phoneNumber;
        } else if (data.userName) {
          console.log("[using default username]");
        } else {
          util.sendError(connection, 406, "malformated user entry");
          break;
        }


        var userName = data.userName;


        if (users[userName]) {
          util.sendError(connection, 406, "username already in use");
          var response = {
            "event": "user not ok",
            "data": {
              "errorMessage": "Username is already taken."
            }
          };
          util.sendMessage(connection, response);
        } else {
          var userId = userName + "" + connection.remotePort;
          users[userName] = {
            userconnection: connection,
            id: userId,
            userName: userName
          };

          console.log(users[userName].userconnection);
          var res = {
            "event": "user ok",
            "data": {
              "userId": userId
            }
          };

          util.sendMessage(connection, res);

          connection.userName = userName;
        }

        break; */

      case "message":
        if (data) {
          var fullDate = util.fullDate();

          // If the boolean data.disconnected is true, then set the response message to
          // 'has disconnected', to let the other user know that 
          var responseMessage = data.disconnected ? 'has disconnected' : data.message;
          responseMessage += " " + fullDate;
          var destination = data.destinationId;

          console.log(responseMessage);

          var conn = util.getConnection(destination);

          
          users[destination].available = data.disconnected || false;

          var rs = {
            "event": "message",
            "data": {
              "message": responseMessage,
              "userName": util.getUser(connection)
              // "be_availabe": data.disconnected
            }
          };

          if (conn) { // if there is a connection, send the response.
            conn.write(JSON.stringify(rs));
          } else {
            util.sendError(connection, 406, "Found no destination to send");
          }

        } else {
          util.sendError(connection, 406, "Found no message to send");
        }
        break;

      case "requestChat":
        var dest = data.destination;
        console.log("[to] ", dest);
        if (users[dest] && users[dest].userconnection === connection) {
          util.sendError(connection, 406, "can't send message to yourself.");
          console.log("[self chat attempt]");
        } else if (users[dest]) {

          var destino = users[dest];

          console.log("[connecting to] ", destino);
          var rspv = {
            "event": "request ok",
            "data": {
              "userId": destino.id
            }
          };

          util.sendMessage(connection, rspv);

          if (data.newChat) { // this is a special condition sent by a mobile
            var name = util.getUser(connection);

            console.log("[user connection] ", name);
            var message = {
              "event": "new chat",
              "data": {
                "destination": name
              }
            };

            var conexion = destino.userconnection;
            destino.available = false; // this users i now occupied
            util.sendMessage(conexion, message);
          }
        } else {
          util.sendError(connection, 400, "Server couldn't process request");
        }
        break;

      case "login":
        // check if this user was loged in before
        var user = data.nickname || data.phonenumber;
        if (user) {
          if (users[user]) {
            console.log('[login user]');
            clearTimeout(user_timeouts[user]);
            users[user].userconnection = connection;
            users[user].available = data.available; // this is a boolean!
          } else {
            // let's register this guy!
            console.log('[adding user]');
            users[user] = {
              userconnection: connection,
              id: user + "" + connection.remotePort,
              userName: user, // This might be causing problems.
              phonenumber: data.phonenumber,
              available: true
            };
          }

          util.sendMessage(connection, {
            "event": "user ok"
          });

        } else {
          util.sendError(connection, 406, "malformated");
        }
        break;

      case 'get users':
        var number = data.number;
        console.log('[number request]', number);
        var user = util.getUsersFromNumber(number);
        console.log('[user is]', user);
        var response_message = {};

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

        util.sendMessage(connection, response_message);
        break;

      case 'set available':
        /*user = data.nickname;
        users[user].available = true;*/
        var nickname = data.nickname;

        util.setAvailable(nickname);


        break;

      default:
        util.sendError(connection, 400, "Server couldn't process request");
        break;
      }
    }
  };

  this.close = function (connection) {
    console.log("[closed connection] ", connection.remoteAddress + ":" + connection.remotePort);
    // console.log("users", users); // uncomment for debuging
    for (var user in users) {
      console.log("current user is: ", users[user].id);
      var userConnection = users[user].userconnection;

      if (connection === userConnection) {
        console.log("[user deleted] ", users[user].id);

        user_timeouts[users[user].userName] = setTimeout(function () {
          delete users[user];
        }, 10000);

      } else {
        console.log("[no user deleted]");
      }

    }
  };
}

var prefix = null,
  port_number = null;
var chat_server = new ChatServer(port_number, prefix);
chat_server.start();