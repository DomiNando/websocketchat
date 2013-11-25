/*global sockJS, chatServer, options, */

var chat = {

  start: function (chatServer, number) {
    if (chatServer !== undefined && chatServer !== null) {
      chatServer.close();
    } else if (number !== '') {  // this parameter must be met or else we close
      chat.number = number;
    } else {
      // nothing to do here
      chatServer.close();
    }

    var chatServer = new SockJS(server, null /*, options */ );

    chatServer.onopen = function () {

      // Create a new user for the chat
      /*var message = {
        "event": "new user",
        "data": {
          //"userName": $name.val(),            
          "phoneNumber": $phoneNumber.val()
        }
      };*/

      var message = {
      'event': 'login',
      'data': {
        'phonenumber': $phoneNumber.val()  //CAMBIE!!
        }
      };

      chatServer.send(JSON.stringify(message));
      chat.createEvents(chatServer);
    };

    chatServer.onmessage = function (response) {
      var e = JSON.parse(response.data);
      var event = e.event;
      var data = e.data;
      switch (event) {
      case "user ok":
        console.log("user ok");
        /*var destination = this.number;
        var message = {
          "event": "requestChat",
          "data": {
            "destination": destination,
            "newChat": true
          }
        };

        chatServer.send(JSON.stringify(message));*/

        console.log('[requesting to chat with number]', chat.number);
        var message = {
          'event': 'get users',
          'data': {
            'number': chat.number
          }
        };

        chat.send(chatServer, message);

        break;
      case "request ok":
        // alert("request ok"); 
        chat.destinationId = data.userId;
        break;
      case "message":
        // alert("got a message");
        var chatMessage = data.message;
        var userName = data.userName;
        var m = "<p><strong>" + userName + "</strong>";
        m += " " + chatMessage + "</p>";
        $messages.append(m);
        break;
      case "error":
        var code = data.errorCode;
        var errorMessage = data.errMessage;
        var message = code + ": " + errorMessage;
        $messages.text(message);
        break;
      case "user not ok":
        // userOk = false;
        alert("Username in use.");
        chat.start(chatServer);

      case 'user_ready':
        var destination = data.user;
        var message = {
          "event": "requestChat",
          "data": {
            "destination": destination,
            "newChat": true
          }
        };

        chat.send(chatServer, message);
        break;

      case 'no_users':
        // we have no users to talk to!
        console.log('[closing]');
        alert('There are no user available for that number');
        chatServer.close();
        break;
      default:

        break;
      }
    };

    chatServer.onclose = function () {
      $sections.hide();
      $('#messages').text('');
      $chat.show();
      $sendButton.off();
    };
  },

  createEvents: function (chatServer) {

    $closeChat.click(function () {
      console.log("[closing]");
      var message = {
          "event" : "message",
          "data" : {
              "disconnected" : true,
              "destinationId": chat.destinationId
          }
      };
      chatServer.send(JSON.stringify(message));
      chatServer.close();
    });

    $sendButton.click(function () {
      var content = $input.val();
      var message = {
        "event": "message",
        "data": {
          "message": content,
          "destinationId": chat.destinationId
        }
      };

      chatServer.send(JSON.stringify(message));

      var chatMessage = content;
      var userName = $phoneNumber.val();
      var m = "<p><strong>" + userName + "</strong>";
      m += " " + chatMessage;

      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear();
      var hr = today.getHours();
      var mins = today.getMinutes();
      var secs = today.getSeconds();
      if (dd < 10) {
        dd = '0' + dd
      }
      if (mm < 10) {
        mm = '0' + mm
      }
      today = mm + '/' + dd + '/' + yyyy;
      var fullDate = "at " + dd + "/" + mm + "/" + yyyy + " " + hr + ":" + mins + ":" + secs;

      m += " " + fullDate + "</p>";

      $messages.append(m);

      $input.val("");

    });
  },

  send: function (chatServer, message) {
    chatServer.send(JSON.stringify(message));
  }
};