var $sendButton = $("#send");
var $closeChat = $("#cancelChat");
var $messages = $("#messages");
var $input = $("#errand");


// configuration
var isConfigured = false;
var server = "http://localhost:3000/chat";
var options = {'protocols_whitelist': ['iframe-xhr-polling','iframe-eventsource','websocket','xhr-streaming', 'xhr-polling']};