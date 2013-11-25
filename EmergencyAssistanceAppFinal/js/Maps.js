/**
 * Created by Jdl28110 on 10/12/13.
 */


 function Map() {

 }


/**
 * Para desplegar el mapa, reciba posiciones y actualiza el mapa, también se llama la función que se encarga de colocar las rutas los
 * mapas.
 */
 Map.displayMap = function(position)
 {

    var userLatLng = null;
    var HospitalLatLng = [];

    for(var i = 0; i < 2; i++){
        if( i==1){
            userLatLng = new google.maps.LatLng(position[i].position.latitude, position[i].position.longitude);
        }
        else{
            if (position[i].position.latitude != 'vacio'){
                HospitalLatLng.unshift(new google.maps.LatLng(position[i].position.latitude, position[i].position.longitude));
            }
        }
    }

    var options = {
        center: userLatLng,
        zoom:14,
        mapTypeControl: true,
        mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
        navigationControl: true,
        navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }



    var map = new google.maps.Map(document.getElementById('map'), options);

    var marker = new google.maps.Marker({
        position: userLatLng,
        map: map,
        Icon: 'images/user-marker.png',
        title: 'Your position'
    });
    var circle  = new google.maps.Circle({
        center: userLatLng,
        radius: position[1].position.accuracy,
        map: map,
        fillColor: '#70E7FF',
        fillOpacity: 0.2,
        strokeColor: '#0000FF',
        strokeOpacity: 1.0
    });

    map.fitBounds(circle.getBounds());

    for ( var e= 0; e <5; e++){
        if (HospitalLatLng[e] != null){
            marker = new google.maps.Marker({
                position: HospitalLatLng[e],
                map: map,
                icon: 'images/hospital-building.png',
                title: 'Hospital position'
            });
            circle = new google.maps.Circle({
                center: HospitalLatLng[e],
                radius: position[e].position.accuracy,
                map: map,
                fillColor: '#70E7FF',
                fillOpacity: 0.2,
                strokeColor: '#0000FF',
                strokeOpacity: 1.0
            });
            map.fitBounds(circle.getBounds());
        }
    }

    // Display route to the car
    options = {
        suppressMarkers: true,
        map: map,
        preserveViewport: true
    }
    for ( var i=0; i <5; i++){
        this.setRoute(new google.maps.DirectionsRenderer(options), userLatLng, HospitalLatLng[i]);
    }

    $.mobile.loading('hide');

}


/**
 * Se encarga de calcular las rutas utilizando la direccion, y las posiciones de los hospitales (Array) y la posicion del usuario
 * La posicion es de tipo LatLng para ambos casos
 * @param directionsDisplay
 * @param userLatLng
 * @param HospitalLatLng
 */

 Map.setRoute = function(directionsDisplay, userLatLng, HospitalLatLng)
 {
    var directionsService = new google.maps.DirectionsService();



    var  request = {
        origin: userLatLng,
        destination: HospitalLatLng,
        travelMode: google.maps.DirectionsTravelMode.WALKING,
        unitSystem: google.maps.UnitSystem.METRIC
    };

    directionsService.route(
                            request,
                            function(response, status)
                            {
                                if (status == google.maps.DirectionsStatus.OK){
                                    directionsDisplay.setDirections(response);
                                    searchfor();
                                }

                                else
                                {
                                    navigator.notification.alert(
                                                                 'Unable to retrieve a route to the Hospital. However, you can still find it by your own.',
                                                                 function(){},
                                                                 'Warning'
                                                                 );
                                }
                            }
                            );

}




/**
 * Función para conseguir el país, ciudad y estado en que se encuentra la persona
 * Esta información es necesaria para que en el servidor se localice los servicios que cubren el área donde se encuentra la persona
 * o los hospitales cerca de la zona.
 */
 Map.requestLocation = function(position, category)
 {
    new google.maps.Geocoder().geocode(
    {
        'location': new google.maps.LatLng(position[0].position.latitude, position[0].position.longitude)
    },
    function(results, status)
    {
        if (status == google.maps.GeocoderStatus.OK)
        {
            var result = results[0];
            var positions = new Position();

            var city = "";
            var state = "";
            var country = "";
            for(var i=0, len=result.address_components.length; i<len; i++) {
                var ac = result.address_components[i];
                if(ac.types.indexOf("locality") >= 0) city = ac.long_name;
                if(ac.types.indexOf("administrative_area_level_1") >= 0) state = ac.long_name;
                if(ac.types.indexOf("country") >= 0) country = ac.long_name;
            }
            positions.updatePosition(0, position[0].position, country, state, city, window.localStorage["username"]);
            getlistofservices(category, position[0].position.latitude, position[0].position.longitude);


        }

    }
    ); return position;
}
