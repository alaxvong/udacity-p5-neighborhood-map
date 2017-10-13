// Model Array

var locationData = [{
  title: 'Chapel Tavern',
  lat: 39.5127098,
  lng: -119.80689
}, {
  title: 'Imbib Custom Brews',
  lat: 39.5276091,
  lng: -119.8010314
}, {
  title: 'Lead Dog Brewing Co.',
  lat: 39.5315294,
  lng: -119.8084458
}, {
  title: 'Pignic',
  lat: 39.5221,
  lng: -119.8158
}, {
  title: 'Pinon Bottle Co',
  lat: 39.5181,
  lng: -119.8081
}, {
  title: 'Reno Public House',
  lat: 39.5182,
  lng: -119.81005549
}, {
  title: 'The Depot Craft Brewery Distillery',
  lat: 39.531084,
  lng: -119.8095549
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

    var infowindow = new google.maps.InfoWindow({});

    // Foursquare API
    var apiUrl = 'https://api.foursquare.com/v2/venues/search?ll=' +
    data.lat + ',' + data.lng + '&client_id=T45HDGHTOTF5Y1NDRLQ1BAUECWZYBJOOAZNS1XDAHCA02O4O&client_secret=HHK4LUEQJGI213DKZF5S0DQKBJ2W22Q5M0D1BHKPLY1RKQOS&query=' + data.title + '&v=20171010&m=foursquare';

    $.getJSON(apiUrl).done(function(marker) {
      var response = marker.response.venues[0];
      self.street = response.location.formattedAddress[0];
      self.city = response.location.formattedAddress[1];

      self.fourSquareContent =
        '<div class="infoWindow">' +
        '<h2 class="infoWindow-title">' + data.title + '</h2>' +
        '<p class="infoWindow-address">' + self.street + '<br>' + self.city +'</p>' +
        '</div>';

      infowindow.setContent(self.fourSquareContent);

    }).fail(function() {
      // Foursquare Error
      alert('Sorry, we were unable to fetch info from Foursquare');
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
    'featureType': 'all',
    'elementType': 'geometry',
    'stylers': [{'visibility': 'off'}]
  }, {
    'featureType': 'all',
    'elementType': 'labels',
    'stylers': [{'visibility': 'off'}]
  }, {
    'featureType': 'landscape',
    'elementType': 'all',
    'stylers': [
      {'color': '#ffffff'},
      {'visibility': 'on'}]
  }, {
    'featureType': 'road',
    'elementType': 'geometry',
    'stylers': [
      {'color': '#cccccc'},
      {'visibility': 'simplified'}]
  }, {
    'featureType': 'road',
    'elementType': 'labels.text.fill',
    'stylers': [
      {'color': '#000000'},
      {'visibility': 'on'}]
  }, {
    'featureType': 'road',
    'elementType': 'labels.text.stroke',
    'stylers': [
      {'color': '#ffffff'},
      {'visibility': 'on'}]
  }]);

}

// View List

function view() {

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

ko.applyBindings(new view());

// Google Maps Errors
function mapsError() {
  $('#map').html('<p class="mapError">Sorry, we were unable to connect with Google Maps</p>');
}
