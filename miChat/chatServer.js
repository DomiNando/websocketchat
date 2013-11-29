var ChatServer = require('./index');

var prefix = null
 ,  port_number = null;
var chat_server = new ChatServer(port_number, prefix);
chat_server.start();