// Model Array

var locationData = [{
  title: 'Chapel Tavern',
  text: '1099 South Virginia Street<br>Reno, NV 89502',
  lat: 39.5127098,
  lng: -119.80689
}, {
  title: 'Imbib Custom Brews',
  text: '785 East 2nd Street<br>Reno, NV 89502',
  lat: 39.5276091,
  lng: -119.8010314
}, {
  title: 'Lead Dog Brewing Co.',
  text: '415 East 4th Street<br>Reno, NV 89512',
  lat: 39.5315294,
  lng: -119.8084458
}, {
  title: 'Pignic Pub & Patio',
  text: '235 Flint Street<br>Reno, NV 89501',
  lat: 39.5221,
  lng: -119.8158
}, {
  title: 'Pinon Bottle Co',
  text: '777 South Center Street #101<br>Reno, NV 89501',
  lat: 39.5181,
  lng: -119.8081
}, {
  title: 'Reno Public House',
  text: '33 St Lawrence Avenue<br>Reno, NV 89501',
  lat: 39.5182,
  lng: -119.81005549
}, {
  title: 'The Depot Craft Brewery Distillery',
  text: '325 East 4th Street<br>Reno, NV 89512',
  lat: 39.531084,
  lng: -119.8095549
}, {
  title: 'The Saint',
  text: '761 South Virginia Street<br>Reno, NV 89501',
  lat: 39.5172564,
  lng: -119.8090445
}];

var locations = ko.observableArray(locationData);

// Init Map

function initMap() {

  var map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 39.52,
      lng: -119.8
    },
    zoom: 14,
    scrollwheel: false
  });

  // Create Markers

  locations().forEach(function (data) {

    var pin = {
      url: 'images/icon-pin.svg',
      anchor: new google.maps.Point(12, 30),
    };

    var pinActive = {
      url: 'images/icon-pin-active.svg',
      anchor: new google.maps.Point(12, 30),
    };

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(data.lat, data.lng),
      icon: pin,
      map: map,
      title: data.title,
      animation: google.maps.Animation.DROP
    });

    var infowindow = new google.maps.InfoWindow({
      content: '<div class="infoWindow"><h2 class="infoWindow-title">' + data.title + '</h2><p class="infoWindow-address">' +
      data.text + '</p></div>'
    });

    data.mapMarker = marker;

    // Map infowindow Interactions

    marker.addListener('click', function () {
      locations().forEach(function (location) {
        if (data.title === location.title) {
          location.infoWindowOpen();
        } else {
          location.infoWindowClose();
        }
      });
    });

    var markerOpen = function () {
      infowindow.open(map, marker);
      marker.setIcon(pinActive);

      // Jquery traverse to remove Google Map prestyled divs without identifiers

      $('.gm-style-iw').prev().hide();
    };

    data.infoWindowOpen = markerOpen.bind();

    var markerClose = function () {
      infowindow.close(map, marker);
      marker.setIcon(pin);
    };
    data.infoWindowClose = markerClose.bind();

    // Close infowindow on map click

    map.addListener('click', function () {
      locations().forEach(function (location) {
        location.infoWindowClose();
      });
    });

  });

  map.set('styles', [{
    "featureType": "all",
    "elementType": "geometry",
    "stylers": [{"visibility": "off"}]
  }, {
    "featureType": "all",
    "elementType": "labels",
    "stylers": [{"visibility": "off"}]
  }, {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [
      {"color": "#ffffff"},
      {"visibility": "on"}]
  }, {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {"color": "#cccccc"},
      {"visibility": "simplified"}]
  }, {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {"color": "#000000"},
      {"visibility": "on"}]
  }, {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      {"color": "#ffffff"},
      {"visibility": "on"}]
  }]);

}

// View List

function View() {

  var self = this;

  // Populate List

  self.locationList = ko.observableArray([]);

  locations().forEach(function (location) {
    location.visible = ko.observable(true);
    self.locationList.push(location);
  });

  // List/Map Interaction

  self.onClickListener = function (data) {
    locations().forEach(function (location) {
      if (data.title === location.title) {
        location.infoWindowOpen();
      } else {
        location.infoWindowClose();
      }
    });
  };

  // Search Functionality

  self.filterValue = ko.observable('');

  self.filterList = ko.computed(function () {
    locations().forEach(function (location) {
      var locationName = location.title.toLowerCase();
      var searchTerm = self.filterValue().toLowerCase();

      // Filter List

      location.visible(locationName.indexOf(searchTerm) > -1);

      // Filter Markers

      if (location.mapMarker) {
        location.mapMarker.setVisible(locationName.indexOf(searchTerm) > -1);
      }
    });
  });

  return self;
}

ko.applyBindings(new View());

// Errors
function mapsError() {
  var myelement = document.getElementById('map');
  myelement.innerHTML = 'Sorry, we were unable to connect with the Google Maps API';
}
