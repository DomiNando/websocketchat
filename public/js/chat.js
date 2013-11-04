var phoneNumber;

var chat = {

	start: function(chatServer) {
		if (chatServer !== undefined) {
			chatServer.close();
		}
		
		if (phoneNumber === undefined || phoneNumber == null) {
		    phoneNumber = prompt("Enter your phone number");
		}

		var chatServer = new SockJS('http://websocketchat-c9-erreh.c9.io/chat', null);

		chatServer.onopen = function() {

			// Create a new user for the chat
			var message = {
    			"event": "new user",
    			"data" : {
        			//"userName": $name.val(),            
        			"phoneNumber": phoneNumber
    			}
			};

			chatServer.send(JSON.stringify(message));
            chat.createEvents(chatServer);		
		};

		chatServer.onmessage = function(response) {
			var e = JSON.parse(response.data);
            var event = e.event;
            var data = e.data;
            switch (event) {
                case "user ok":
                	console.log("user ok");
                    var request = prompt("Enter destination:");
					var message = {
		                "event" : "requestChat",
		                "data" : {
		                    "destination" : request
		                }
		            };

		            chatServer.send(JSON.stringify(message));
                    break;
                case "request ok":
               		// alert("request ok"); 
                    destinationId = data.userId;
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
                    $messages.append(message);
                    break;
                case "user not ok":
                	// userOk = false;
                	alert("Username in use.");
					chat.start(chatServer);
                default:
                    
                    break;
            }
		};
	},

	createEvents: function(chatServer) {
        
        $closeChat.click(function() {
            console.log("[closing]");
            ref.close();
        });
        
        $sendButton.click(function() {
            var content = $input.val();
            var message = {
                "event" : "message",
                "data" : {
                    "message" : content,
                    "destinationId": destinationId
                }
            };
            
            chatServer.send(JSON.stringify(message));
            
            var chatMessage = content;
            var userName = phoneNumber
            var m = "<p><strong>" + userName + "</strong>";
                m += " " + chatMessage;
            
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1;
            var yyyy = today.getFullYear();
            var hr = today.getHours();
            var mins = today.getMinutes();
            var secs = today.getSeconds();
            if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = mm+'/'+dd+'/'+yyyy;
            var fullDate ="at "+dd+"/"+mm+"/"+yyyy+" "+hr+":"+mins+":"+secs;
            
                m += " " + fullDate + "</p>";
            
            $messages.append(m);
            
            $input.val("");
            
        });
	},

	close: function(chatServer) {
		$sendButton.off();
		// $closeChat.off();
		chatServer.close();
	},

	send: function(chatServer, message) {
		chatServer.send(JSON.stringify(message));
	}
};