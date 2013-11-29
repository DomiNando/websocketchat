/*global require, console */
var express = require('express');
var chat_http = require('http');
var main_server = express();
var sockjs = require("sockjs");
var http_server = chat_http.createServer(main_server);
var sockjs_opts = {  sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js" };

function ChatServer(chat_port, chat_prefix) {
  'use strict';
  // setup the server
  this.chat_server = sockjs.createServer(sockjs_opts);
  this.port_number = chat_port || process.env.PORT || 3500;
  this.prefix = chat_prefix || '/chat';

  // users
  this.users = {};
  this.user_timeouts = [];

  // utility
  this.util = require('./lib/util');
}

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
      _self.respond(connection, request, _self.users);
    });

    // here we simply dereference the connection from the users list
    connection.on('close', function () {
      _self.close(connection);
    });
  });
};

ChatServer.prototype.respond = function (connection, request, users) {
  // let's make sure the request is not empty or not valid json
  if (request === null || !util.jsonTest(request)) {
    console.log(request + " from " + connection.remoteAddress + ":" + connection.remotePort);
    this.util.sendError(connection, 400, "Server couldn't process request");
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
        var fullDate =this.util.fullDate();

        // If the boolean data.disconnected is true, then set the response message to
        // 'has disconnected', to let the other user know that 
        var responseMessage = data.disconnected ? 'has disconnected' : data.message;
        responseMessage += " " + fullDate;
        var destination = data.destinationId;

        console.log(responseMessage);

        var conn = this.util.getConnection(destination);

        
        for (var user in users) {
          if (users[user].id === destination) {
            console.log(users[user]);
           this.users[user].available = data.disconnected || false;
          }
        }

        var rs = {
          "event": "message",
          "data": {
            "message": responseMessage,
            "userName": this.util.getUser(connection)
            // "be_availabe": data.disconnected
          }
        };

        if (conn) { // if there is a connection, send the response.
          conn.write(JSON.stringify(rs));
        } else {
         this.util.sendError(connection, 406, "Found no destination to send");
        }

      } else {
       this.util.sendError(connection, 406, "Found no message to send");
      }
      break;

    case "requestChat":
      var dest = data.destination;
      console.log("[to] ", dest);
      if (users[dest] &&this.users[dest].userconnection === connection) {
       this.util.sendError(connection, 406, "can't send message to yourself.");
        console.log("[self chat attempt]");
      } else if (users[dest]) {

        var destino =this.users[dest];

        console.log("[connecting to] ", destino);
        var rspv = {
          "event": "request ok",
          "data": {
            "userId": destino.id
          }
        };

       this.util.sendMessage(connection, rspv);

        if (data.newChat) { // this is a special condition sent by a mobile
          var name =this.util.getUser(connection);

          console.log("[user connection] ", name);
          var message = {
            "event": "new chat",
            "data": {
              "destination": name
            }
          };

          var conexion = destino.userconnection;
          destino.available = false; // this users i now occupied
         this.util.sendMessage(conexion, message);
        }
      } else {
       this.util.sendError(connection, 400, "Server couldn't process request");
      }
      break;

    case "login":
      // check if this user was loged in before
      var user = data.nickname || data.phonenumber;
      if (user) {
        if (users[user]) {
          console.log('[login user]');
          clearTimeout(this.user_timeouts[this.user]);
         this.users[user].userconnection = connection;
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
        }

       this.util.sendMessage(connection, {
          "event": "user ok"
        });

      } else {
       this.util.sendError(connection, 406, "malformated");
      }
      break;

    case 'get users':
      var number = data.number;
      console.log('[number request]', number);
      var user =this.util.getUsersFromNumber(number);
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

     this.util.sendMessage(connection, response_message);
      break;

    case 'set available':
      /*user = data.nickname;
     this.users[user].available = true;*/
      var nickname = data.nickname;

     this.util.setAvailable(nickname);


      break;

    default:
     this.util.sendError(connection, 400, "Server couldn't process request");
      break;
    }
  }
};

ChatServer.prototype.close = function (connection) {
  console.log("[closed connection] ", connection.remoteAddress + ":" + connection.remotePort);
  // console.log("users", users); // uncomment for debuging
  for (var user in users) {
    console.log("current user is: ",this.users[user].id);
    var userConnection = this.users[user].userconnection;

    if (connection === userConnection) {
      console.log("[user deleted] ", this.users[user].id);

      this.user_timeouts[this.users[user].userName] = setTimeout(function () {
        deletethis.users[user];
      }, 10000);

    } else {
      console.log("[no user deleted]");
    }

  }
};

var prefix = null
 ,  port_number = null;
var chat_server = new ChatServer(port_number, prefix);
chat_server.start();