// include required libraries
var http = require("http");
var sockjs = require("sockjs");
var express = require("express");

// configuration an utility variables
var util = {
    test: function(text) {
        if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            //the json is ok
            return true;
        }
        
        return false;
    },
    
    sendError: function(connection, code, message) {
        var mes = {
            "event": "error",
            "data": {
                "errorCode": code,
                "errMessage": message
            }
        };
    
        connection.write(JSON.stringify(mes));
    },
    
    getConnection: function(destination) {
        for (var user in users) {
            if (users[user].id === destination) {
                return users[user].userconnection;
            }
        }
    },
    
    sendMessage: function(connection, message) {
        connection.write(JSON.stringify(message));
    },
    
    getUser: function(connection) {
        for (var user in users) {
            if (users[user].userconnection == connection) {
                console.log("[returning user] ", users[user].userName);
                return users[user].userName;
            }
        }
        
        return false;
    }
};
var sockjs_opts = {sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js"};
var oneDay = 86400000;

// initial setup
var server = express();
var http_server = http.createServer(server);
var chat_server = sockjs.createServer(sockjs_opts);

chat_server.installHandlers(http_server, { prefix: '/chat' });
http_server.listen(process.env.PORT || 3000); // para correr en localhost no hay que hacer cambios aqui,
                                              // solo correr node server.js y cambiar el destino del cliente
                                              // a http://localhost:3000/chat

// this server just serves up static content
server.use(express.compress()); // we compress the static content for up to one day
server.use('/', express.static(__dirname + '/public', { maxAge: oneDay }));

// main chat code is here
var users = {};
var user_timeouts = [];
chat_server.on('connection', function(connection) {
        console.log("[new connection]", connection.remoteAddress);
        console.log("[port] ", connection.remotePort);
        console.log(connection.remoteAddress + ":" + connection.remotePort);

        connection.on('data', function(request) {
            // let's make sure the request is not empty or not valid json
            if (request === null || !util.test(request)) {
                console.log(request + " from " + connection.remoteAddress + ":" + connection.remotePort);
                util.sendError(connection, 400, "Server couldn't process request");
            } else {
                // now that we know the request is valid json, let's parse it
                // and react to the events
                var e = JSON.parse(request);
                var eventType = e.event;
                var data = e.data;
                console.log("[event]", eventType);
                
                switch (eventType) {
                    case "new user":
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
                                "event" : "user not ok",
                                "data" : {
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
                            var response = {
                                "event" : "user ok",
                                "data" : {
                                    "userId" : userId
                                }
                            };
                            
                            util.sendMessage(connection, response);
                            
                            // un-comment the following for debuging purposes
                            // console.log("Users in object till now");
                            // for (var user in users) {
                            //     var userId = users[user].id;
                            //     console.log("user id: ", userId);
                            // }
                            
                            connection.userName = userName;
                        }
                        
                        break;
                    case "message":
                        if (data) {
                            var today = new Date();
                            var dd = today.getDate();
                            var mm = today.getMonth()+1;
                            var yyyy = today.getFullYear();
                            var hr = today.getHours();
                            var mins = today.getMinutes();
                            var secs = today.getSeconds();
                            if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = mm+'/'+dd+'/'+yyyy;
                            var fullDate ="at "+dd+"/"+mm+"/"+yyyy+" "+hr+":"+mins+":"+secs;
                            
                            var responseMessage = data.message;
                            responseMessage += " " + fullDate;
                            var destination = data.destinationId;
                            
                            console.log(responseMessage);
                            
                            var conn = util.getConnection(destination);
                            
                            var response = {
                                "event": "message",
                                "data": {
                                    "message" : responseMessage,
                                    "userName": connection.userName
                                }
                            };
                            if (conn) {
                                conn.write(JSON.stringify(response));
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
                             util.sendError(connection,406, "can't send message to yourself.");
                             console.log("[self chat attempt]");
                         } else if (users[dest]) {
                            
                            var destination = users[dest];
                            console.log("[destination] ", destination);
                            
                            console.log("[connecting to] ", destination);
                            var response = {
                                "event" : "request ok",
                                "data" : {
                                    "userId": destination.id
                                }
                            };
                            
                            util.sendMessage(connection, response);
                            
                            if (data.newChat) {
                                var name = util.getUser(connection);
                                
                                console.log("[user connection] ", name);
                                var message = {
                                    "event": "new chat",
                                    "data" : {
                                        "destination": name
                                    }
                                };
                                
                                var conn = users[dest].userconnection;
                                util.sendMessage(conn, message);
                            }
                        } else {
                            util.sendError(connection, 400, "Server couldn't process request");
                        }
                        break;
                    case "login":
                        // check if this user was loged in before
                        if (data.phonenumber) {
                            // if (data.username && users[data.username]) {
                            //     users[data.username].userconnection = connection;
                            // } else {
                            //     var userId = data.username + "" + connection.remotePort;
                            //     users[data.username] = {
                            //         userconnection: connection,
                            //         id: userId,
                            //         userName: data.username
                            //     };
                            // }
                            if (users[data.phonenumber]) {
                                clearTimeout(user_timeouts[data.phonenumber]);
                                users[data.phonenumber].userconnection = connection;
                            } else {
                                // let's register this guy!
                                users[data.phonenumber] = {
                                    userconnection: connection,
                                    id: data.phonenumber + "" + connection.remotePort,
                                    userName: data.phonenumber
                                };
                            }

                        } else {
                            util.sendError(connection, 406, "malformated");
                        }
                        break;
                    default:
                        util.sendError(connection, 400, "Server couldn't process request");
                        break;
                }
            }
        });
    
    // here we simply dereference the connection from the users list
    connection.on('close', function() {
        console.log("[closed connection] ", connection.remoteAddress + ":" + connection.remotePort);
        // console.log("users", users); // uncomment for debuging
        for (var user in users) {
            console.log("current user is: ", users[user].id);
            var userConnection = users[user].userconnection;
            if (connection === userConnection) {
                console.log("[user deleted] ", users[user].id); 
                user_timeouts[users[user].userName] = setTimeout(function() {
                    delete users[user];
                }, 10000);
            } else {
                console.log("[no user deleted]");
            }
        }
    });
});