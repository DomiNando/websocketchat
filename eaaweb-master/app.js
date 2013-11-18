
/**
 * Module dependencies.
 */

var admin = require('./routes/admin');
var stat = require('./routes/stat');
var sp = require('./routes/sp');
var mobile = require('./routes/mobile');
var user = require('./routes/user');

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static('public'));

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    
    console.log('Server');

    next();
};

app.configure(function () {
  app.use(allowCrossDomain);
});

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', function(req, res){res.render('./login/login');});
app.post('/login', user.login);
app.post('/retrievePassword', user.retrievePassword);

app.get('/search', admin.search);
app.get('/searchResult', admin.searchResult);

app.get('/newService', admin.newService);
app.post('/add', admin.add);
app.get('/viewDetail', admin.viewDetail);
app.get('/edit', admin.editService);
app.post('/update', admin.deleteAgency);
app.post('/delete', admin.deleteAgency);
app.get('/validateAgency', admin.validateAgency);

app.get('/newUser', admin.newUser);
app.post('/addUser', admin.addUser);
app.get('/viewDetailUser', admin.viewDetailUser);
app.get('/editUser', admin.editUser);
app.post('/updateUser', admin.updateUser);
app.post('/deleteUser', admin.deleteUser);
app.get('/validateUser', admin.validateUser);

app.get('/stat', function(req, res){res.render('./stat/stat');});
app.get('/filterCategory', stat.filterCategory);
app.get('/filterCountry', stat.filterCountry);
app.get('/filterState', stat.filterState);
app.get('/filterCity', stat.filterCity);
app.get('/filterAgency', stat.filterAgency);
app.get('/agencyStat', stat.agencyStat);
app.get('/employeeStat', stat.employeeStat);
app.get('/emergencyResult', function(req, res){res.render('./stat/emergencyResult');});
app.get('/agencyResult', stat.agencyEmergency);
app.get('/employeeResult', stat.employeeEmergency);
app.get('/emergencyDetail', stat.emergencyDetail);

app.get('/sp', function(req, res){res.render('./sp/activeEmergency');});
app.post('/saveEmergency', sp.saveEmergency);
app.post('/relayEmergency', sp.relayEmergency);
app.get('/retrieveRelay', sp.retrieveRelay);
app.get('/history', function(req, res){res.render('./sp/history');});
app.get('/historyResult', sp.historyResult);
app.get('/retrieveHistory', sp.retrieveHistory);

app.get('/mobile', function(req, res){res.render('./mobile/home');});
app.get('/mobileEmergency', function(req, res){
    //console.log('mobile request');
    //res.json({list:'ok'});
    if(req.query.category=='hospital')
        mobile.hospitalCoordinate(req, res);
    else
        mobile.servicePhoneNumber(req, res);
});
//app.get('/servicePhoneNumber', mobile.servicePhoneNumber);
//app.get('/hospitalPhoneNumber', mobile.hospitalPhoneNumber);
app.get('/registerDevice', mobile.registerDevice);

// Added http_server variable for chat functinality
var http_server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});


/**
* Chat Server Begins here.
*/

// include required libraries
var sockjs = require("sockjs");

// configuration an utility variables
var util = require('./routes/util');
var sockjs_opts = {sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js"};
var oneDay = 86400000;

// initial setup
var chat_server = sockjs.createServer(sockjs_opts);

chat_server.installHandlers(http_server, { prefix: '/chat' });

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