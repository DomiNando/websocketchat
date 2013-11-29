/*global exports,  JSON */
exports.jsonTest = function (text) { // function to test if a string converts to valid JSON.
  try {
    JSON.parse(text);
  } catch (error) {
    return false;
  }

  return true;
};

exports.sendError = function (connection, code, message) {
  var mes = {
    "event": "error",
    "data": {
      "errorCode": code,
      "errMessage": message
    }
  };

  connection.write(JSON.stringify(mes));
},

exports.getConnection = function (destination) {
  for (var user in users) {
    if (users[user].id === destination) {
      return users[user].userconnection;
    }
  }
};

  // method to return list of users based on their phone numbers
exports.getUsersFromNumber = function (number) {     
  var current_user;

  for (var user in users) {
    current_user = users[user];

    if (current_user.phonenumber === number && current_user.available) {
      return current_user.userName;    // if we find a match let's return it
    }
  }

  // if no users were found return false
  return false;

  /*console.log(users_that_match.toString());
  return users_that_match;*/
};

exports.sendMessage = function (connection, message) {
  connection.write(JSON.stringify(message));
};

exports.getUser = function (connection) {
  for (var user in users) {
    if (users[user].userconnection == connection) {
      console.log("[returning user] ", users[user].userName);
      return users[user].userName;
    }
  }

  return false;
};

exports.fullDate = function () {
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

exports.setAvailable = function(nickname) {
  for (var user in users) {
    var current_user = users[user];

    if (current_user.userName === nickname) {
      current_user.available = true;
      return true;
    }
  }
};
