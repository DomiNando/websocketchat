var emergencyApp = {
    var count = 1;
    init: function () {

        if (isConfigured) { //el usuario entro un numero de telefono y acepto los terminos de servicio
            emergencyApp.createEvents(); //la aplicacion espera porque los botones se aprieten
            $login.hide(); //esconde la pagina de login
            $main.fadeIn("fast", emergencyApp.mainPage()); //la pagina de los botones call aparece

        } else {
            $registrationPage.hide();
            $login.show();

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

    registrationPage: function () {
        $register.click(function () {

            if ($userName.val() !== null || $name.val() !== null) {
                var numero = parseInt($userName.val(), 10);
                var numNoDecimal = parseInt(numero); //si termsAccepted esta marcado, el largo del numero de telefono es 10, y el password de usuario es igual al password guardado...
                if (!isNaN(numero) && numero === numNoDecimal && numero > 0) {
                    var dUsername = $userName.val();
                    var name = $name.val();

                    $.ajax({
                        type: "GET",
                        url: "http://eaa.ece.uprm.edu:3000/registerDevice",
                        contentType: "application/json",
                        data: {
                            clientPhoneNumber: dUsername,
                            name: name
                        },
                        success: function (responseServer) {

                            if (responseServer.result == "Success") {

                                /// si la validacion es correcta, muestra la pantalla "LoginPage"
                                window.localStorage["username"] =
                                    dUsername;

                                $sections.hide();
                                $login.show();

                            } else {
                                navigator.notification.alert(
                                    "Your registration failed",
                                    function () {});
                                $sections.hide();
                                $login.show();
                            }

                        },
                        error: function () {
                            navigator.notification.alert(
                                "Your registration failed", function () {}
                            );
                        }
                    });
                }

            }

        });
    },

    chatTime: function (category) {

        // navigator.geolocation.getCurrentPosition(onSuccess, onError);

        // var onSuccess = function(position) {
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
            //if ( checkRequirements()== true){
            $sections.hide();
            var category = 'police';
            var positions = new Position();
            var position = positions.getPositions();
            arrayStack.push($main);
            Map.requestLocation(position, category);
            setTimeout(function () {
                $call.fadeIn("fast");
                console.log('police!', position);

            }, 2000);
            //}
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
            if (checkRequirements() == true) {
                $sections.hide();
                var positions = new Position();
                var position = positions.getPositions();
                arrayStack.push($otherServices);
                Map.requestLocation(position, 'hospital');
                setTimeout(function () {
                    $hospitalPage.fadeIn("fast");
                    var positions = new Position();
                    Map.displayMap(positions.getPositions());;
                }, 3000);
            }
        });

        $towingServices.click(function () {
            if (checkRequirements() == true) {
                $sections.hide();
                var positions = new Position();
                var position = positions.getPositions();
                arrayStack.push($otherServices);
                var category = 'towingservices';
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
            //if ( checkRequirements()== true){
            $sections.hide();
            var category = 'police';
            var positions = new Position();
            var position = positions.getPositions();
            arrayStack.push($chooseChat);
            Map.requestLocation(position, category);
            setTimeout(function () {
                $chat.fadeIn("fast");
                console.log('police!', position);

            }, 2000);
            //}
        });

        $chatFirefighters.click(function () {
            //if ( checkRequirements()== true){
            $sections.hide();
            var category = 'firefighter';
            var positions = new Position();
            var position = positions.getPositions();
            arrayStack.push($chooseChat);
            Map.requestLocation(position, category);
            setTimeout(function () {
                $chat.fadeIn("fast");
                console.log('firefighters!', position);

            }, 2000);
            //}
        });

        $chatAmbulance.click(function () {
             //if ( checkRequirements()== true){
            $sections.hide();
            var category = 'ambulance';
            var positions = new Position();
            var position = positions.getPositions();
            arrayStack.push($chooseChat);
            Map.requestLocation(position, category);
            setTimeout(function () {
                $chat.fadeIn("fast");
                console.log('ambulance!', position);

            }, 2000);
            //}
        });

        $startChat.click(function () {
            $sections.hide();
            $chatPage.fadeIn("fast");
            var position = new Position();
            var numbers = position.getPositions();
            console.log('numbers', numbers);
            var telephone = numbers[emergencyApp.count].mobile;
            if (telephone != 'vacio' && telephone != window.localStorage["username"]) {
                chat.setDest(telephone);
                chat.start()
            } else {
                alert("There are no more users to chat with");
            } //NEED WAYYY BETTER FIX THAN THIS!!!
        });

        $chatNextButton.click(function () {
            $sections.hide();
            var numbers = new Position();
            var telephones = numbers.getPositions();

            if (emergencyApp.count = telephones.length - 1) {
                emergencyApp.count = 1;
                arrayStack = [];
                $sections.hide();
                $main.fadeIn("fast");
            } else {
                do {
                    emergencyApp.count++;
                } while ((telephones[emergencyApp.count].mobile = 'vacio' ||
                        telephones[emergencyApp.count].mobile !=
                        window.localStorage["username"]) &&
                    emergencyApp.count < telephones.length - 1);

                arrayStack.push($chat);
                $chat.fadeIn("fast");
            }
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
            emergencyApp.count = emergencyApp.count > 1 ? count - 1 : count;

            var numbers = new Position();
            var telephones = numbers.getPositions();

            if (emergencyApp.count = 1) {
                $sections.hide();
                arrayStack.pop(arrayStack.length - 1).fadeIn("fast");
            } else {
                do {
                    emergencyApp.count--;
                } while ((telephones[emergencyApp.count].mobile = 'vacio' ||
                        telephones[emergencyApp.count].mobile !=
                        window.localStorage["username"]) &&
                    emergencyApp.count > 1);
                arrayStack.pop(arrayStack.length-1).fadeIn("fast");
            }
        });


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
            alert(
                'Oops, could not find you, is your GPS enable or do you have a connection?'
            );
        }, geolocationOptions);

}




//realiza la llamada de servidor, llama siempre al número de teléfono primero en la lista
// Ya que Next la lista se actualiza
function ChatAhora() {
    var position = new Position();
    var numbers = position.getPositions();
    console.log('numbers', numbers);
    var telephone = numbers[emergencyApp.count].mobile;
    if (telephone != 'vacio' && telephone != window.localStorage["username"]) {

        //if (navigator.userAgent.indexOf("Android") != -1) {
        //document.location.href = 'tel:' + telephone;
        chat.setDest(telephone);
        /*
       else if (navigator.userAgent.indexOf("iPhone") != -1) {
        window.location = 'telprompt://' + telephone;
       } */
   } else {
    alert("There are no more users to chat with");
    }
}



    //funcion para realizar la llamada al otro servidor en la lista, actualiza la lista borrando el objeto tipo mobil
    // primero en la lista, cosa de que cuando se llame CallNumber, se utilice el proximo numero.
    function chatProximo() {
        //var numbers = new Position();
        //var telephones = numbers.getPositions();
        emergencyApp.count++;
        /*if ( telephones[count].mobile != 'vacio' && telephones[1].mobile != window.localStorage["username"]){
    numbers.deletePosition(1);
    CallNumber();
    }
    else {
        alert(" There is not next number");
    }*/
    }

    function checkRequirements() {
        if (navigator.connection.type == Connection.NONE) {
            navigator.notification.alert(
                'To use this app you must enable your internet connection',
                function () {},
                'Warning'
            );
            return false;
        }

        return true;
    }