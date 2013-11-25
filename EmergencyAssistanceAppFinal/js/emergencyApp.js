'use strict';

var _db = window.sessionStorage;

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

      $seeTerms.click(function () {
        $login.hide();
        $termsOfService.fadeIn("fast");
        emergencyApp.termsOfServicePage();
        return false;
      });


      $registerButton.click(function () {
        $sections.hide();
        $registrationPage.fadeIn("fast");
        emergencyApp.registrationPage();
      });

      $done.click(function () {
        var $termsAccepted = $("#termsAccepted").is(":checked");
        console.log($termsAccepted);
        var phon = $phoneNumber.val();
        if (window.localStorage["username"] == phon) {
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

  mainPage: function () {

    $other.click(function () {
      $sections.hide();
      arrayStack.push($main);
      $otherServices.fadeIn("fast");
    });
  },

  termsOfServicePage: function () {
    $back.click(function () {
      $termsOfService.hide();
      $login.show();
    });
  },

  registrationPage: function () {
    $register.click(function () {

      if (($userName.val() !== null || $name.val() !== null) && $userName.val().length == 10) {
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

              if (responseServer.result == "Success") {

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
              navigator.notification.alert("Your registration failed", function () {});
            }
          });
        }

      }

    });
  },

  createEvents: function () {

    $registerButton.click(function () {
      $sections.hide();
      $registrationPage.fadeIn("fast");
    });

    $back.click(function () {
      $sections.hide();
      $main.fadeIn("fast", emergencyApp.mainPage());
    });

    $police.click(function () {
      if ( checkRequirements()== true){
      $sections.hide();
      var category = 'police';
      var positions = new Position();
      var position = positions.getPositions();
      arrayStack.push($main);
      Map.requestLocation(position, category);
      setTimeout(function () {
        $call.fadeIn("fast");
      }, 2000);
       }
    });

    $firefighters.click(function () {
      if (checkRequirements() == true) {
        $sections.hide();
        var category = 'firefighter';
        var positions = new Position();
        var position = positions.getPositions();
        arrayStack.push($main);
        Map.requestLocation(position, category);
        setTimeout(function () {
          $call.fadeIn("fast");
        }, 2000);
      }
    });

    $ambulance.click(function () {
      if (checkRequirements() == true) {
        $sections.hide();
        var category = 'ambulance';
        var positions = new Position();
        var position = positions.getPositions();
        arrayStack.push($main);
        Map.requestLocation(position, category);
        setTimeout(function () {
          $call.fadeIn("fast");
        }, 2000);
      }
    });

    $call911.click(function () {
      arrayStack = [];
      if (navigator.userAgent.indexOf("Android") != -1) {
        document.location.href = 'tel:911';
      } else if (navigator.userAgent.indexOf("iPhone") != -1) {
        window.location = 'telprompt://911';
      }
    });

    $hospitals.click(function () {
      if ( checkRequirements()== true){
      $sections.hide();
      var positions = new Position();
      var position = positions.getPositions();
      arrayStack.push($otherServices);
      Map.requestLocation(position, 'hospital');
      setTimeout(function () {
        $hospitalPage.fadeIn("fast");
        Map.displayMap();
      }, 3000);
      }
    });

    $towingServices.click(function () {
      if ( checkRequirements()== true){
      $sections.hide();
      var positions = new Position();
      var position = positions.getPositions();
      arrayStack.push($otherServices);
      var category = 'tow';
      Map.requestLocation(position, category);
      setTimeout(function () {
        $call.fadeIn("fast");
      }, 2000);
      }
    });

    $chatButton.click(function () {
      $sections.hide();
      arrayStack.push($otherServices);
      $chooseChat.fadeIn("fast");
    });

    $chatPolice.click(function () {
      /*$sections.hide();
      arrayStack.push($chooseChat);
      $chat.fadeIn("fast");*/

      $sections.hide();
      var category = 'police';
      var positions = new Position();
      var position = positions.getPositions();
      arrayStack.push($chooseChat);
      Map.requestLocation(position, category);

      setTimeout(function () {
        emergencyApp.generateList(position);
        $chat.fadeIn("fast");
      }, 2000);
    });

    $chatFirefighters.click(function () {
      $sections.hide();
      var category = 'firefighter';
      var positions = new Position();
      var position = positions.getPositions();
      arrayStack.push($chooseChat);
      Map.requestLocation(position, category);

      setTimeout(function () {
        emergencyApp.generateList(position);
        $chat.fadeIn("fast");
      }, 2000);
    });

    $chatAmbulance.click(function () {
    	$sections.hide();
      var category = 'ambulance';
      var positions = new Position();
      var position = positions.getPositions();
      arrayStack.push($chooseChat);
      Map.requestLocation(position, category);

      setTimeout(function () {
        emergencyApp.generateList(position);
        $chat.fadeIn("fast");
      }, 2000);
    });

    $startChat.click(function () {
      $sections.hide();
      $chatPage.fadeIn("fast");
      /*var position = new Position();
      var numbers = position.getPositions();
      var telephone = numbers[emergencyApp.count].mobile !== window.localStorage.getItem('username') ? numbers[emergencyApp.count].mobile : numbers[emergencyApp.count].mobile;*/

      var telephone = _db.getItem('list').split(',')[emergencyApp.count];
      alert("telephone: " + telephone);
      chat.start(null, telephone);
    });

    $chatNextButton.click(function () {
      $sections.hide();

      if (emergencyApp.count < _db.getItem('list').split(',').length - 1) {
        emergencyApp.count++;
        $sections.hide();
        arrayStack.push($chat);
        $chat.fadeIn('fast');
      } else {
        emergencyApp.count = 0;
        arrayStack = [];
        $sections.hide();
        $main.fadeIn("fast");
      }

      $('p #number_here').text(emergencyApp.list[emergencyApp.count]);

    });

    $callNext.click(function () {
      arrayStack = [];
      Next();
    });

    $hangUp.click(function () {
      arrayStack = [];
      CallNumber();
    });

    $previous.click(function () {
      $sections.hide();
      arrayStack.pop(arrayStack.length - 1).fadeIn("fast");
      emergencyApp.count = emergencyApp.count > 0 ? emergencyApp.count - 1 : emergencyApp.count;
    });


  },

  generateList: function(position) {

    var numbers = [];

    for (var p in position) {
      numbers.push(position[p].mobile);
    }

    var list = numbers.filter(function (item, index, inputArray) {
      return inputArray.indexOf(item) == index;
    });

    _db.setItem('list', list.slice(1).toString().replace(/\s+/g, ''));
  }
};

//Recopila toda la informacion necesaria para Hospitales o llamadas
// Latitud y Longitud por medio de Geolocation
// Ciudad, Pais y estado utilizando Geocoder
// Se encuentra la funcion displayMap para crear y desplegar las posiciones, y rutas
// Se busca la lista de telefones y latitudes y longitudes ( en caso de Hospitales)
function searchfor() {


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

      if (window.localStorage["status"] != 'main') {
        window.localStorage["status"] = 'main';
        emergencyApp.init(); //recursion para comenzar Configurado
      }
    },

    function locationFail() {
      alert('Oops, could not find you, is your GPS enable or do you have a connection?');
    }, geolocationOptions);

}




//realiza la llamada de servidor, llama siempre al número de teléfono primero en la lista
// Ya que Next la lista se actualiza
function CallNumber() {
  var position = new Position();
  var numbers = position.getPositions();
  var telephone = numbers[1].mobile;
  //alert("telephone: " + telephone);
  if (telephone != 'vacio' && telephone != window.localStorage["username"]) {
    if (navigator.userAgent.indexOf("Android") != -1) {
      document.location.href = 'tel:' + telephone;
    } else if (navigator.userAgent.indexOf("iPhone") != -1) {
      window.location = 'telprompt://' + telephone;
    }
  } else {
    alert("There is not number to call");
  }
}




//funcion para realizar la llamada al otro servidor en la lista, actualiza la lista borrando el objeto tipo mobil
// primero en la lista, cosa de que cuando se llame CallNumber, se utilice el proximo numero.
function Next() {
  var numbers = new Position();
  var telephones = numbers.getPositions();
  if (telephones[1].mobile != 'vacio' && telephones[1].mobile != window.localStorage["username"]) {
    numbers.deletePosition(1);
    CallNumber();
  } else {
    alert(" There is not next number");
  }
}

function checkRequirements() {
  if (navigator.connection.type == Connection.NONE) {
    alert('To use this app you must enable your internet connection');
    return false;
  }

  return true;
}