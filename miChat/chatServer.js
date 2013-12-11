<<<<<<< HEAD
//Creates new chat server
=======
>>>>>>> 41a1d980455d1e35ddd4448ac6a9c659bbd21e8d
var ChatServer = require('./index');

var prefix = null, 
    port_number = null;
var chat_server = new ChatServer(port_number, prefix);
chat_server.start();