/*global sockJS, chatServer, options, */

var number  = new Number();

//Chat creator
var chat = {

  start: function (chatServer, number) {
    this.retryCount = 0;
    this.destinationId = '';

    if (chatServer !== undefined && chatServer !== null) {
      chatServer.close();
    } else if (number !== '') {  // this parameter must be met or else we close
      chat.number = number;
    } else {
      // nothing to do here
      chatServer.close();
    }

    var chatServer = new SockJS(server, null /*, options */ );


//Reacts to the open event, sending a login event
    chatServer.onopen = function () {
      var message = {
        'event': 'login',
        'data': {
          'phonenumber': $phoneNumber.val()  //CAMBIE!!
          }
      };

      chatServer.send(JSON.stringify(message));
      chat.createEvents(chatServer);
    };
//Reacts to the message event, parsing for specific cases
    chatServer.onmessage = function (response) {
      var e = JSON.parse(response.data);
      var event = e.event;
      var data = e.data;
      switch (event) {
//Reacts to user ok event, by sending a new chat event
      case "user ok":
        console.log("user ok");
        
        console.log('[requesting to chat with number]', chat.number);
        var message = {
          'event': 'new chat',
          'data': {
            'number': chat.number
          }
        };

        chat.send(chatServer, message);

        break;
//Reacts to request ok event, by setting the destination of the messages to the userId
      case "request ok":
        // alert("request ok"); 
        chat.destinationId = data.userId;
        break;
//Reacts to the message event, by posting the message in the user's chat window and scrolling down the window
      case "message":
        // alert("got a message");
        var chatMessage = data.message;
        var username = data.username;
        var m = "<p><strong>" + username + "</strong>";
        m += " " + chatMessage + "</p>";
        $messages.append(m);
        $messages.scrollTop($messages[0].scrollHeight); //NUEVO SCROLL DOWN MENSAJES
        break;
//Reacts to the error event, by posting the error message in the user's chat window
      case "error":
        var code = data.errorCode;
        var errorMessage = data.errMessage;
        var message = code + ": " + errorMessage;
        $messages.text(message);
        break;
//Reacts to the user not ok event by sending an alert, and starting the chat again
      case "user not ok":
        // userOk = false;
        alert("username in use.");
        chat.start(chatServer);
//Reacts to the user_ready event by sending a requestChat event
      case 'user_ready':
        var destination = data.user;
        var message = {
          "event": "requestChat",
          "data": {
            "destination": destination
          }
        };

        chat.send(chatServer, message);
        break;
/*Reacts to the no_users event, by resending the new chat event 3 times, if it fails, it throws an alert, if it succeeds, the
conversation can begin*/
      case 'no_users':
        // we have no users to talk to!
        if (chat.retryCount < 3) {
          var retry_message = {
            'event': 'new chat',
            'data': {
              'number': chat.number
            }
          };

          chat.retryCount++;

          chat.send(chatServer, retry_message);
        } else {
          console.log('[closing]');
          alert('There are no user available for that number');
          chatServer.close();
        }
        break;
//Reacts to the web disconnect event, throws an alert saying that the web user disconnected, and closes the conversation
      case "web disconnect":
        alert("The agent has disconnected, please press cancel or wait 30 seconds.");
        setTimeout(function () {
          chatServer.close();
        }, 30000);
      break;
      default:

        break;
      }
    };

//Reacts to the close event by setting the chat messages to empty, and deactivating the chat messages and going to the previous page
    chatServer.onclose = function () {
      $sections.hide();
      $('#messages').text('');
      $chat.show();
      $sendButton.off();
    };
  },

  createEvents: function (chatServer) {

/*Listener for the closeChat button click, sends a message event with the data:disconnected true property, also sends a set 
available event to set the destination to available*/
    $closeChat.click(function () {
      console.log("[closing]");
      var message = {
          "event" : "message",
          "data" : {
              "destinationId": chat.destinationId,
              "disconnected" : true
          }
      };

      var rp = {
       "event" : "set available",
        "data" : {
          "destinationId": chat.destinationId
        }
      };
      
      chat.send(chatServer, rp);
      chat.send(chatServer, message);

      setTimeout(function () {
        chatServer.close();
      }, 2000);
    });

//Listener for the send button, sends a message event with the user information
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
      var username = $phoneNumber.val();
      var m = "<p><strong>" + username + "</strong>";
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
      $('#messages').scrollTop($('#messages')[0].scrollHeight);

      $input.val("");

    });
  },

//Sends the message to the Chat Server
  send: function (chatServer, message) {
    chatServer.send(JSON.stringify(message));
  }
};