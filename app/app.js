mapboxgl.accessToken = 'pk.eyJ1IjoiYXVjaGVuYmVyZyIsImEiOiJjaWhtazd2b3QwMGY1dXNrcTd5N3V6NmM4In0.IjgFjyBRjdmUdi2MxSlw2w';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-68.13734351262877, 45.137451890638886],
    minZoom: 1,
    zoom: 1,
    maxZoom: 5,
});

    var geo  =new MapboxGeocoder({
        accessToken: mapboxgl.accessToken
    });

    map.addControl(geo);

map.on('load', function () {

    map.addSource('countries', {
        'type': 'geojson',
        'data': 'countries.geo.json'
    });

    map.addLayer({
        "id": "country-borders",
        "type": "line",
        "source": "countries",
        "layout": {},
        "paint": {
            "line-color": "#627BC1",
            "line-width": 1
        }
    });

    map.addLayer({
        'id': 'country-fills',
        'type': 'fill',
        'source': 'countries',
        'layout': {},
        'paint': {
            'fill-color': '#627BC1',
            'fill-opacity': 0.1
        }
    });

    map.addLayer({
        "id": "country-hover",
        "type": "fill",
        "source": "countries",
        "layout": {},
        "paint": {
            "fill-color": "#627BC1",
            "fill-opacity": 1
        },
        "filter": ["==", "ADMIN", ""]
    });

    map.addLayer({
        'id': 'country-visited',
        'type': 'fill',
        'source': 'countries',
        'layout': {},
        'paint': {
            'fill-color': '#f44336',
            'fill-opacity': 0.3
        },
        'filter' : ["in", "name", ""]
    });


    // Reset the state-fills-hover layer's filter when the mouse leaves the map
    map.on("mouseout", function() {
        map.setFilter("country-hover", ["==", "name", ""]);
    });

    map.on("mousemove", function(e) {
        var features = map.queryRenderedFeatures(e.point, { 
            layers: ["country-fills"]
        });


        if (features.length) {
            map.setFilter("country-hover", ["==", "name", features[0].properties.name]);
        } else {
            map.setFilter("country-hover", ["==", "name", ""]);
        }
    });    

    map.on("click", function(e) {

      var features = map.queryRenderedFeatures(e.point, { layers: ["country-fills"] });

      if (features.length) {

        var currentCountry = features[0].properties.name
        var filter = map.getFilter("country-visited");
        var highlightedCountries;

        if(filter && filter.length) {
          var existingCountries = filter.slice(2)

          if(existingCountries.indexOf(currentCountry) > -1) {
            // Remove
            highlightedCountries = existingCountries.filter(function(c) {
              return c !== currentCountry
            })
          } else {
            // Add
            highlightedCountries = existingCountries.concat([currentCountry])
          }

        } else {
          highlightedCountries = [currentCountry]
        }

        map.setFilter("country-visited", ["in", "name"].concat(highlightedCountries));
      }


    })

});

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCPSaBT7rQHGwnfnl1cS7sjSGOoNWISMn0",
  authDomain: "visited-c083d.firebaseapp.com",
  databaseURL: "https://visited-c083d.firebaseio.com",
  storageBucket: "visited-c083d.appspot.com",
};

firebase.initializeApp(config);


function login() {
  var provider = new firebase.auth.FacebookAuthProvider();

  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;

    console.log('user', user)
    // ...
  }).catch(function(error) {
    console.log('error', error)
  });

}

document.querySelector('.sign-in').addEventListener('click', function() {
  login()
}, false)