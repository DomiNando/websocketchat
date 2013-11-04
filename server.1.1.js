var http = require('http');
var sockjs = require('sockjs');
var fs = require('fs');
// jsonTeston tests if input is valid json.
var jsonTester = {
    test: function(text) {
        if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            //the json is ok
            return true;
        }
        
        return false;
    }
};

// process.env.PORT is a variable in Cloud9 and not part of Node
// process.env.PORT stores the port number for node, but if it is
// not defined we define it ourselved and use that port instead.
if (process.env.PORT === undefined || process.env.PORT === null) {
    process.env.PORT = 2000;
}

var users = {};
var chat_server = sockjs.createServer();
var http_server = http.createServer();
chat_server.installHandlers(http_server, {
    prefix: '/chat',
    disconnect_delay: 6000000
});
http_server.listen(process.env.PORT);

http_server.on('request', function(request, response) {
        var url = require('url').parse(request.url);

        console.log("Requested URL is: ", url.href);

        // response.writeHead(200, {"Content-Type": "text/plain; charset=UTF-8"});
        if (url.href === '/') {
                var html = fs.readFileSync('index.html', 'utf8', function(error) {
                        if (error) { 
                throw error; 
            }
                });
                // console.log(html);
                //response.writeHead(200, {"Content-Type": "text/html; charset=UTF-8"});
                response.write(html);
                response.end();
        }  else if (url.href === '/androidChat') {
            fs.readFile('androidChat.html', function(err, content) {
                if (err) {
                    response.setHeader('content-type', 'text/html; charset=UTF-8')
                    response.writeHead(200);
                    response.write("<h2>404 : Chat not found</h2>");
                    response.end();
                } else {
                    response.setHeader('content-type', 'text/html; charset=UTF-8')
                    response.writeHead(200);
                    response.write(content);
                    response.end();
                }
            });
        } else if (url.href !== '/chat') {
            var filename = url.pathname.substring(1); 
            var type;
            
            switch(filename.substring(filename.lastIndexOf(".")+1)) { // extension
                case "html":
                case "htm": type = "text/html; charset=UTF-8"; break;
                case "js": type = "application/javascript; charset=UTF-8"; break;
                case "css": type = "text/css; charset=UTF-8"; break;
                case "txt" : type = "text/plain; charset=UTF-8"; break;
                case "manifest": type = "text/cache-manifest; charset=UTF-8"; break;
                default: type = "application/octet-stream"; break;
            }
            
            fs.readFile(filename, function(err, content) {
                if (err) { // If we couldn't read the file for some reason
                    //response.writeHead(404, {
                    //     // Send a 404 Not Found status
                         //"Content-Type": "text/html; charset=UTF-8"});
                    //response.write(err.message); // Simple error message body
                    response.write("404 : Resource Not Found");
                    response.end();
                    // Done
                } else {
                    // Otherwise, if the file was read successfully.
                    response.setHeader('content-type', type);
                    response.writeHead(200);
                    response.write(content); // Send file contents as response body
                    response.end();
                    // And we're done
                }
            });
        }
});

function sendError(connection, code, message) {
    var mes = {
        "event": "error",
        "data": {
            "errorCode": code,
            "errMessage": message
        }
    };

    connection.write(JSON.stringify(mes));
}

function getConnection(destination) {
    for (var user in users) {
        if (users[user].id === destination) {
            return users[user].userconnection;
        }
    }
}

chat_server.on('connection', function(connection) {
        console.log("conection received from: ", connection.remoteAddress);
        console.log("With port number: ", connection.remotePort);
        console.log(connection.remoteAddress + ":" + connection.remotePort);

        connection.on('data', function(request) {
        if (request === null || !jsonTester.test(request)) {
            console.log(request + " from " + connection.remoteAddress + ":" + connection.remotePort);
            sendError(connection, 400, "Server couldn't process request");
        } else {
            var message = JSON.parse(request);
            var eventType = message.event;
            console.log("Event Type: ", eventType);
            
            switch (eventType) {
                case "new user":
                    if (message.data.phoneNumber) {
                        message.data.userName = message.data.phoneNumber;
                    } else if (message.data.userName) {
                        console.log("userName default");
                    } else {
                        sendError(connection, 406, "malformated user entry");
                        break;
                    }
                    
                    
                    var userName = message.data.userName;
                    
                    
                    if (users.userName) {
                        sendError(connection, 406, "username already in use");
                        var response = {
                            "event" : "user not ok",
                            "data" : {
                                "errorMessage": "Username is already taken."
                            }
                        };
                        connection.write(JSON.stringify(response));
                    } else {
                        var userId = userName + "" + connection.remotePort;
                        users[userName] = {
                            userconnection: connection,
                            id: userId
                        };
                        
                        console.log(users[userName].userconnection);
                        var response = {
                            "event" : "user ok",
                            "data" : {
                                "userId" : userId
                            }
                        };
                        
                        connection.write(JSON.stringify(response));
                        
                        console.log("Users in object till now");
                        for (var user in users) {
                            var userId = users[user].id;
                            console.log("user id: ", userId);
                        }
                        
                        connection.userName = userName;
                    }
                    
                    break;
                case "message":
                    if (message.data) {
                        var today = new Date();
                        var dd = today.getDate();
                        var mm = today.getMonth()+1;
                        var yyyy = today.getFullYear();
                        var hr = today.getHours();
                        var mins = today.getMinutes();
                        var secs = today.getSeconds();
                        if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = mm+'/'+dd+'/'+yyyy;
                        var fullDate ="at "+dd+"/"+mm+"/"+yyyy+" "+hr+":"+mins+":"+secs;
                        
                        var responseMessage = message.data.message;
                        responseMessage += " " + fullDate;
                        var destination = message.data.destinationId;
                        
                        console.log(responseMessage);
                        
                        var conn = getConnection(destination);
                        
                        var response = {
                            "event": "message",
                            "data": {
                                "message" : responseMessage,
                                "userName" : connection.userName
                            }
                        };
                        if (conn) {
                            conn.write(JSON.stringify(response));
                        } else {
                            sendError(connection, 406, "Found no destination to send");
                        }
                    } else {
                        sendError(connection, 406, "Found no message to send");
                    }
                    break;
                case "requestChat":
                    var dest = message.data.destination;
                    console.log("to: ", dest);
                     if (users[dest] && users[dest].userconnection === connection) {
                         sendError(connection,406, "can't send message to yourself.");
                         console.log("Attempt to chat with self");
                     } else if (users[dest]) {
                         
                        var destination = users[dest];
                        console.log("user is: ", destination);
                        
                        console.log("request to connect to: ", destination);
                        var response = {
                            "event" : "request ok",
                            "data" : {
                                "userId": destination.id
                            }
                        };
                        connection.write(JSON.stringify(response));
                    } else {
                        sendError(connection, 400, "Server couldn't process request");
                    }
                    break;
                default:
                    sendError(connection, 400, "Server couldn't process request");
                    break;
            }
                }
    });
    
    // here we simply dereference the connection from the users list
    connection.on('close', function() {
        console.log("connection closed from: ", connection.remoteAddress + ":" + connection.remotePort);
        console.log("users", users);
        for (var user in users) {
            console.log("current user is: ", users[user].id);
            var userConnection = users[user].userconnection;
            if (connection === userConnection) {
                console.log("deleted user: ", users[user].id);
                delete users.user;
            } else {
                console.log("no user deleted");
            }
        }
    });
});