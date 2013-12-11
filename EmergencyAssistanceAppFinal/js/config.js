// App pages: These JQuery variables reference the different pages in our app
var $login = $("#login");
var $main = $("#mainPage");
var $call = $("#call");
var $otherServices = $("#otherServices");
var $chat = $("#chat");
var $chooseChat = $("#chooseChat");
var $startChat = $("#startChat");
var $chatNextButton = $("#next");
var $chatPage= $("#chatScreen");
var $hospitalPage = $("#hospitals");
var $registrationPage = $("#registrationPage");   //
var $chatWindow =$("chatting");
var $termsOfService = $("#termsOfService");


// Elements: These JQuery variables mostly reference DOM elements in our app
var $back = $(".back");
var $done = $("#done");
var $phoneNumber = $("#userPhoneNumber");
var $sections = $("section");
var $call911 = $("#call911");
var $police = $("#police");
var $firefighters = $("#firefighters");
var $ambulance = $("#ambulance");
var $hospitals = $("#hospitalsButton");
var $other = $("#other");
var $towingServices = $("#towingButton");
var $chatButton = $("#chatButton");
var $chatPolice = $("#chatPolice");
var $chatFirefighters = $("#chatFirefighters");
var $chatAmbulance = $("#chatAmbulance");
var $callNext = $("#callNext");
var $hangUp = $("#hangUp");
var $previous = $("#previous");
var $registerButton = $("#registerButton");
var $register = $("#register");
var $userName = $("#userName");
var $password = $("#clave");
var $confirmPassword = $("#confirmPassword");
var $name = $("#name");
var $userPassword = $("#userPassword");
var $nextChat = $("#next");
var $seeTerms = $("#seeTerms");
var counter = 0;
var arrayStack = new Array();
var usersArray = new Array(10);
var receiver = usersArray[0];

// chat specific buttons

var $sendButton = $("#send");
var $closeChat = $("#cancelChat");
var $messages = $("#messages");
var $input = $("#errand");


// configuration
var isConfigured = false;
var server = "http://eaa.ece.uprm.edu:3500/chat";
var options = {'protocols_whitelist': ['websocket', 'xdr-streaming', 'xhr-streaming', 'iframe-eventsource', 'iframe-htmlfile', 'xdr-polling', 'xhr-polling', 'iframe-xhr-polling', 'jsonp-polling']}