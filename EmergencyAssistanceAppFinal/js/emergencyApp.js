'use strict';

var _db = window.sessionStorage;
var mode;

var emergencyApp = {

  init: function () {
    this.count = 0;

    if (isConfigured) { //el usuario entro un numero de telefono y acepto los terminos de servicio
      emergencyApp.createEvents(); //la aplicacion espera porque los botones se aprieten
      $login.hide(); //esconde la pagina de login
      $main.fadeIn("fast", emergencyApp.mainPage()); //la pagina de los botones call aparece

    } else {
      $registrationPage.hide();
      $login.show();
      
      $("#userPhoneNumber").attr('maxlength','10');

//seeTerms button click listener: takes user to Terms and Conditions page
      $seeTerms.click(function () {
        $login.hide();
        $termsOfService.fadeIn("fast");
        emergencyApp.termsOfServicePage();
        return false;
      });

//registerButton click listener: takes user to Registration page
      $registerButton.click(function () {
        $sections.hide();
        $registrationPage.fadeIn("fast");
        emergencyApp.registrationPage();
      });

/*Done button click listener if user checked the termsAccepted checkbox, and the phone number he/she just input is the same as
the one he inputted in the registration page, he/she will log on to the application. If not, an alert will pop up.*/
      $done.click(function () {
        var $termsAccepted = $("#termsAccepted").is(":checked");
        console.log($termsAccepted);
        var phon = $phoneNumber.val();
        if (window.localStorage["username"] === phon) {
          if ($termsAccepted) {
            isConfigured = true;
            window.localStorage["status"] = 'no';

            console.log($termsAccepted);
            searchfor();
          } else {
            alert("You must accept terms and  agreements");
          }
        } else {

          var phone = window.localStorage["username"];
          for (var index = 0; index < phone.length; index++) {
            if (index > 6) {
              phone = phone.replaceAt(index, "*");
            }
          }
          alert("Your login failed, your number is: " + phone);

        }

      });
    }
  },

  mainPage: function() {
//otherServices button click listener: Takes user to the Other Services page
    $other.click(function () {
      $sections.hide();
      arrayStack.push($main);
      $otherServices.fadeIn("fast");
    });
  },

//back button click listener: Takes user to the Login page
  termsOfServicePage: function() {
    $back.click(function () {
      $termsOfService.hide();
      $login.show();
    });
  },

  registrationPage: function() {
/*register button click listener: if the phone number the user inputted is of length 10, and positive integer, the user will 
register into the database. If not, he/she will not be registered. There must be connection to the server for a success.*/
    $register.click(function () {

      if (($userName.val() !== null || $name.val() !== null) && $userName.val().length === 10) {
        var numero = parseInt($userName.val(), 10);
        var numNoDecimal = parseInt(numero); //si termsAccepted esta marcado, el largo del numero de telefono es 10, y el password de usuario es igual al password guardado...
        if (!isNaN(numero) && numero === numNoDecimal && numero > 0) {
          var dUsername = $userName.val();
          var name = $name.val();

          $.ajax({
            type: "GET",
            url: "http://eaa.ece.uprm.edu:3600/registerDevice",
            contentType: "application/json",
            data: {
              clientPhoneNumber: dUsername,
              name: name
            },
            success: function (responseServer) {

              if (responseServer.result === "Success") {

                /// si la validacion es correcta, muestra la pantalla "LoginPage"
                window.localStorage["username"] = dUsername;

                $sections.hide();
                $login.show();

              } else {
                navigator.notification.alert("Your registration failed", function () {});
                $sections.hide();
                $login.show();
              }

            },
            error: function () {
              navigator.notification.alert("Your registration failed ajax error", function () {});
            }
          });
        }

      }

    });
  },

  createEvents: function() {

    $registerButton.click(function () {
      $sections.hide();
      $registrationPage.fadeIn("fast");
    });
//back button click listener: takes user back to the main page
    $back.click(function () {
      $sections.hide();
      $main.fadeIn("fast", emergencyApp.mainPage());
    });

//callPolice click button listener: requests police category phone list from the server
      $police.click(function () {
          if ( checkRequirements()== true){

              mode = "0";
              var category = 'police';
              var positions = new Position();
              var position = positions.getPositions();
              arrayStack.push($main);
              Map.requestLocation(position, category);

          }
      });
//callFirefighters click button listener: requests firefighter category phone list from the server
      $firefighters.click(function () {
          if (checkRequirements() == true) {
              mode = "0";
              var category = 'firefighter';
              var positions = new Position();
              var position = positions.getPositions();
              arrayStack.push($main);
              Map.requestLocation(position, category);

          }
      });
//callAmbulance click button listener: requests ambulance category phone list from the server
      $ambulance.click(function () {
          if (checkRequirements() == true) {
              mode = "0";
              var category = 'ambulance';
              var positions = new Position();
              var position = positions.getPositions();
              arrayStack.push($main);
              Map.requestLocation(position, category);

          }
      });
//call911 button click listener: sets 911 as the phone number to call in the phone dialer and displays the dialer
      $call911.click(function () {
          arrayStack = [];
          if (navigator.userAgent.indexOf("Android") != -1) {
              document.location.href = 'tel:911';
          } else if (navigator.userAgent.indexOf("iPhone") != -1) {
              window.location = 'telprompt://911';
          }
      });

//hospitals button click listener: requests hospitals category coordinates and sets them in the map.
      $hospitals.click(function () {
          if ( checkRequirements()== true){
              mode = "2";
              var positions = new Position();
              var position = positions.getPositions();
              arrayStack.push($otherServices);
              Map.requestLocation(position, 'hospital');

          }
      });

//callTowingServices button click listener: requests tow category phone number list from the server
      $towingServices.click(function () {
          if ( checkRequirements()== true){
              mode = "0";
              var positions = new Position();
              var position = positions.getPositions();
              arrayStack.push($otherServices);
              var category = 'tow';
              Map.requestLocation(position, category);

          }
      });

//chatButton click listener: takes the user to the chooseChat page
      $chatButton.click(function () {
      $sections.hide();
      arrayStack.push($otherServices);
      $chooseChat.fadeIn("fast");
    });

//chatPolice button click listener: sets the chat for police category
    $chatPolice.click(function () {
      /*$sections.hide();
      arrayStack.push($chooseChat);
      $chat.fadeIn("fast");*/

      setupChat('police');
    });

//chatFirefighters button click listener: sets the chat for firefighter category
    $chatFirefighters.click(function () {
       setupChat('firefighter');
    });

//chatAmbulance button click listener: sets the chat for ambulance category
    $chatAmbulance.click(function () {
       setupChat('ambulance');
    });

//startChat button click listener: takes the user to the Chat page, and starts the chat
    $startChat.click(function () {
      $sections.hide();
      $chatPage.fadeIn("fast");
      /*var position = new Position();
      var numbers = position.getPositions();
      var telephone = numbers[emergencyApp.count].mobile !== window.localStorage.getItem('username') ? numbers[emergencyApp.count].mobile : numbers[emergencyApp.count].mobile;*/

      //var telephone = _db.getItem('list').split(',')[emergencyApp.count];
      //alert("telephone: " + telephone);
      Chat();
    });

//chatNext button click listener: sets the next number in the phone list as the next chat target by invoking chatNext()
    $chatNextButton.click(function () {
      $sections.hide();

      // if (emergencyApp.count < _db.getItem('list').split(',').length - 1) {
      //   emergencyApp.count++;
      //   $sections.hide();
      //   arrayStack.push($chat);
      //   $chat.fadeIn('fast');
      //   $('#number_here')
      //   .text(_db.getItem('list')
      //     .split(',')[emergencyApp.count]
      //     .toString()
      //   );
      // } else {
      //   emergencyApp.count = 0;
      //   arrayStack = [];
      //   $sections.hide();
      //   $main.fadeIn("fast");
      // }
      
      ChatNext();

      

    });

//callNext button click listener: sets the next phone number in the list as the current call target by invoking Next()
    $callNext.click(function () {
      arrayStack = [];
      Next();
    });

//call button click listener: sets the current phone number in the phone dialer by invoking callNumber()
    $hangUp.click(function () {
      arrayStack = [];
      CallNumber(); 
    });
//Not being used
    $previous.click(function () {
      $sections.hide();
      arrayStack.pop(arrayStack.length - 1).fadeIn("fast");
      emergencyApp.count = emergencyApp.count > 0 ? emergencyApp.count - 1 : emergencyApp.count;
    });
  }
};

//Recopila toda la informacion necesaria para Hospitales o llamadas
// Latitud y Longitud por medio de Geolocation
// Ciudad, Pais y estado utilizando Geocoder
// Se encuentra la funcion displayMap para crear y desplegar las posiciones, y rutas
// Se busca la lista de telefones y latitudes y longitudes ( en caso de Hospitales)
var searchfor = function() {


  var geolocationOptions = {
    timeout: 15 * 1000, // 15 seconds
    maximumAge: 10 * 1000, // 10 seconds
    enableHighAccuracy: true
  };
  var positions = new Position();

  navigator.geolocation.getCurrentPosition(
    function (location) {
      var latitude = location.coords.latitude;
      var longitude = location.coords.longitude;

      positions.savePosition(
        new Coords(
          location.coords.latitude,
          location.coords.longitude,
          location.coords.accuracy
        ), "Country", "State", "City", window.localStorage["username"]
      );

      if (window.localStorage["status"] !== 'main') {
        window.localStorage["status"] = 'main';
        emergencyApp.init(); //recursion para comenzar Configurado
      }
      else
      {
          //alert("Mode "+ mode);
          if (mode == "0"){
              $sections.hide();
              $call.fadeIn("fast");
          }
          else if (mode == "2"){
             //alert("entro a mode 2");
              $sections.hide();
              $hospitalPage.fadeIn("fast");

              Map.displayMap();
          }
          else{
              $sections.hide();
              Chat(true);
              $chat.fadeIn("fast");
          }

      }
    },

    function locationFail() {
      alert('Oops, could not find you, is your GPS enabled, or do you have a connection?');
    }, geolocationOptions);
};

//realiza la llamada de servidor, llama siempre al nÃºmero de telÃ©fono primero en la lista
// Ya que Next la lista se actualiza
var CallNumber = function() {
  var position = new Position();
  var numbers = position.getPositions();
  var telephone = numbers[1].mobile;
  alert("telephone: " + telephone);
  if (telephone !== 'vacio' && telephone !== window.localStorage["username"]) {
    if (navigator.userAgent.indexOf("Android") !== -1) {
      document.location.href = 'tel:' + telephone;
      return false;
    } else if (navigator.userAgent.indexOf("iPhone") !== -1) {
      window.location = 'telprompt://' + telephone;
      return false;
    }
  } else {
    alert("There is no number to call");
    return false;
  }
};




//funcion para realizar la llamada al otro servidor en la lista, actualiza la lista
// borrando el objeto tipo mobil
// primero en la lista, cosa de que cuando se llame CallNumber, se utilice el proximo numero.
var Next = function() {
  var numbers = new Position();
  var telephones = numbers.getPositions();
  if (telephones[1].mobile !== 'vacio' && telephones[1].mobile !== window.localStorage["username"]) {
    numbers.deletePosition(1);
    CallNumber();
  } else {
    alert(" There is no next number");
  }
};

//Checks if the user has internet connection, if false throws a warning
var checkRequirements = function() {
  if (navigator.connection.type === Connection.NONE) {
    navigator.notification.alert(
      'To use this app you must enable your internet connection',
      function () {},
      'Warning'
    );
    return false;
  }

  return true;
};


//takes the user into the Chat page
var setupChat = function(category) {
  //$sections.hide();
  mode = '1';
  var positions = new Position();
  var position = positions.getPositions();
  Map.requestLocation(position, category);
  arrayStack.push($chooseChat);

  /*setTimeout(function () {
    Chat(true);
    $chat.fadeIn("fast");
  }, 3000);*/
};

// var generateList = function() {
//   var numbers = [], passed = false, list = [];
//   var positions = new Position();
//   var position = positions.getPositions();

//   for (var el in position) {
//     console.log('before numbers', position[el].mobile);
//   }

//   Object.keys(position).forEach(function (element, index, array) {
//      numbers.push(position[element].mobile);
//   });

//   numbers.forEach(function (element, index, array) { 
//     console.log('after numbers ' + element + ' at index ' + index);
//   });

//   list = numbers.filter(function (element, index, array) {
//     if (element === 'vacio') passed = true;
//     if (element !== 'vacio' && !passed) {
//       return array.indexOf(element) === index;
//     }
//   });

//   for (var el in list) {
//     console.log('after list', list[el]);
//   }

//   list = list.slice(0, 4);

//   // this eliminates spaces.
//   _db.setItem('list', list.slice(1).toString().replace(/\s+/g, ''));
// };

//realiza la llamada de servidor, llama siempre al numero de telefono primero en la lista
// Ya que Next la lista se actualiza
//Retrieves list for chat, as long as the number retrieved is not own number, or empty, it sets the number on the screen, and
//as the next chat target, and starts the chat
var Chat = function(bool) {
  var position, numbers, telephone;
  var booleano = bool;
    position = new Position();
    numbers = position.getPositions();
    telephone = numbers[1].mobile;
    /*if(telephone === numbers[2].mobile) {
    	Chat(booleano);
    }
    else {*/
  //alert("telephone: " + telephone);
  		if (telephone !== 'vacio' && telephone !== window.localStorage["username"]) {
    	$('#number_here').text(telephone);
    	if (bool !== true) {
      	chat.start(null, telephone);
      	return false;
    	}
  		} else {
    //alert("There is not number to call");
    	$sections.hide();
    	$main.fadeIn("fast");
    	return false;
  		}
  //}
};




//funcion para realizar la llamada al otro servidor en la lista, actualiza la lista
// borrando el objeto tipo mobil
// primero en la lista, cosa de que cuando se llame CallNumber, se utilice el proximo numero.
var ChatNext = function() {
  var numbers = new Position();
  var telephones = numbers.getPositions();
  if (telephones[1].mobile !== 'vacio' && telephones[1].mobile !== window.localStorage["username"]) {
    numbers.deletePosition(1);
    $sections.hide();
    $chat.fadeIn('fast');
    $('#number_here').text(numbers.getPositions()[1].mobile);
    Chat(true);
  } else {
    $sections.hide();
    $main.fadeIn("fast");
  }
};