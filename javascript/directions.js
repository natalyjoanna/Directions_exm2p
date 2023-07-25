//const { response } = require("express");
var map;
var mylatlng = { lat:21.12516505715344, lng: -101.68429684075595};

function initMap() {

  // crear el mapa con opciones especificas
  map = new google.maps.Map(document.getElementById("googleMap"), {
    center: mylatlng,
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  // Load the GeoJSON data
  fetch('http://172.18.70.37:4001/api/branches/all')
  .then(response => response.json())
  .then(data => {
    data.forEach(branch => {
      const position = new google.maps.LatLng(branch.latestLatitude, branch.latestLongitude); 
      // crear marcadores de cada sucursal
      const marker = new google.maps.Marker({
        position: position,
        map: map,
        title: branch.name,
        icon: {
          url: 'https://cdn-icons-png.flaticon.com/128/727/727606.png',
          scaledSize: new google.maps.Size(40, 40)
        }
      });
    });
  })
  .catch(error => console.log(error));
}

initMap() 

// Coordenadas Usuario
const latitud = Number(localStorage.getItem('latitud'));
const longitud = Number(localStorage.getItem('longitud'));
const nombre = localStorage.getItem('nombre');


console.log(latitud,longitud,nombre);

const userPosition = { lat: latitud, lng: longitud };

// crear marcador con la ubicacion del usuario
const deliveryMarker = new google.maps.Marker({
  position: { lat: latitud, lng: longitud },
  map: map,
  title: nombre,
  icon: {
    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    scaledSize: new google.maps.Size(40, 40)
  }
});

 // mostrar la ubicacion del usuario
 deliveryMarker.setMap(map);

 const coordenadasEstaticas = [
  { lat: 21.159029240771236, lng: -101.69622769271979, name: "Mc Donald's Plaza Mayor" },
  { lat: 21.122379356345995, lng: -101.68277416430692, name: "Mc Donald's Centro" },
  { lat: 21.100236382275913, lng: -101.63810306683952, name: "Mc Donald's Centro Max" },
  { lat: 21.143451163275174, lng: -101.68500575505843, name: "Mc Donald's La Gran Plaza" },
  { lat: 21.150719189674792, lng: -101.67062465816417, name: "Mc Donald's Blvrd Miguel Hidalgo" }
];

// Función para calcular la distancia euclidiana entre dos puntos
function euclideanDistance(a, b) {
  const dx = a.lat - b.lat;
  const dy = a.lng - b.lng;
  return Math.sqrt(dx * dx + dy * dy);
}

// variables para almacenar la ruta más cercana y su distancia
let closestRoute;
let closestDistance = Infinity;

const directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();
directionsDisplay.setMap(map);
let outputText = '';

coordenadasEstaticas.forEach(coordenada => {
  const request = {
    origin: userPosition,
    destination: coordenada,
    travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING AND TRANSIT
    unitSystem: google.maps.UnitSystem.IMPRERIAL
  };

  directionsService.route(request, (result, status) => {
    if (status == google.maps.DirectionsStatus.OK) {
      const distance = result.routes[0].legs[0].distance.value;
      const duration = result.routes[0].legs[0].duration.text;
      console.log(`Distancia: ${distance}, Duración: ${duration}`);

      const currentDistance = euclideanDistance(userPosition, coordenada);
      
      if (currentDistance < closestDistance) {
        closestDistance = currentDistance;
        closestRoute = result;
      }
      outputText += "<div class='alert-info'>From: " + 
            nombre +
            ". <br />To: " + 
            coordenada.name +
            ". <br />Driving distance <i class='fas fa-road'></i> :" + 
            result.routes[0].legs[0].distance.text +
            ". <br />Duration <i class='fas fa-hourglass-start'></i> :" + 
            result.routes[0].legs[0].duration.text +
            ".</div>" +
            "</br>";
    } else {
      //delete the routes from map
      directionsDisplay.setDirections({routes: []});
      map.setCenter(mylatlng);
      //show error message
      output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle-start'></i>Could not retrieve driving distance. </div>";
  }

  if (closestRoute) {
    directionsDisplay.setDirections(closestRoute);
  }

  output.innerHTML = outputText;

  });
});
