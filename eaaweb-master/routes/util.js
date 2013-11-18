var exports = {
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