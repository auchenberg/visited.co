
function initAutocomplete() {

  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });


  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

var world_geometry = new google.maps.FusionTablesLayer({
  query: {
    select: 'geometry',
    from: '1N2LBk4JHwWpOY4d9fobIn27lfnZ5MDy-NoqqRpk'
  },
  map: map,
  suppressInfoWindows: true
});

  // Adds an info window on click with in a state that includes the state name and COLI
  // stateLayer.addListener('click', function(e) {
  //   console.log(e);
  //   infoWindow.setContent('<div style="line-height:1.00;overflow:hidden;white-space:nowrap;">' +
  //     e.feature.getProperty('NAME') + '<br> COLI: ' +
  //     e.feature.getProperty('COLI') + '</div>');

  //   var anchor = new google.maps.MVCObject();
  //   anchor.set("position", e.latLng);
  //   infoWindow.open(map, anchor);
  // });


  // Final step here sets the stateLayer GeoJSON data onto the map
  stateLayer.setMap(map);

}


  // returns a color based on the value given when the function is called
function getColor(coli) {
  var colors = [
    '#d1ccad',
    '#c2c083',
    '#cbd97c',
    '#acd033',
    '#89a844'
  ];

  return coli >= 121 ? colors[4] :
    coli > 110 ? colors[3] :
    coli > 102.5 ? colors[2] :
    coli > 100 ? colors[1] :
    colors[0];
}


// // Initialize Firebase
// var config = {
//   apiKey: "AIzaSyCPSaBT7rQHGwnfnl1cS7sjSGOoNWISMn0",
//   authDomain: "visited-c083d.firebaseapp.com",
//   databaseURL: "https://visited-c083d.firebaseio.com",
//   storageBucket: "visited-c083d.appspot.com",
// };
// firebase.initializeApp(config);