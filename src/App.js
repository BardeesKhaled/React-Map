import React, { Component } from 'react';
import './App.css';
import PlacesList from './Component/PlacesList'

class App extends Component {
   constructor(props) {
        super(props);
        this.state = {
         'locations':
  [
    { 
      title:'Library of Alexandria',
      location: {lat:31.2089, lng:29.9092}
    },
    { title:'Alexandria Zoo',
      location: {lat:31.2040, lng:29.9450}
    },
    { title:'Stanley Bridge',
      location: {lat:31.2352, lng:29.9489}
    },
    { title:'Cook Door',
      location: {lat:31.2470, lng:29.9697}
    },
    { title:'Citadel of Qaitbay',
      location: {lat:31.2140, lng:29.8856}
    },

  ],
          'map': '',
          'infowindow': '',
          'prevmarker': ''
        }
         this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
    }
    componentDidMount() {
        window.initMap = this.initMap;
        // Asynchronously load the Google Maps script, passing in the callback reference
        loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyARC-a63vxOWRRAgpjnDYOndn_2fFLYhAo&callback=initMap')
    }
    initMap() {
        var self = this;

        var mapview = document.getElementById('map');
        mapview.style.height = window.innerHeight + "px";
        var map = new window.google.maps.Map(mapview, {
            center: {lat: 31.2001, lng: 29.9187},
            zoom: 12,
            mapTypeControl: false
        });

        var InfoWindow = new window.google.maps.InfoWindow({});

        window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
            self.closeInfoWindow();
        });

        this.setState({
            'map': map,
            'infowindow': InfoWindow
        });
        window.google.maps.event.addListener(map, 'click', function () {
            self.closeInfoWindow();
        });

        var locations = [];
        this.state.locations.forEach(function (location) {
            var longname = location.title ;
            var marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(location.location.lat, location.location.lng),
                animation: window.google.maps.Animation.DROP,
                map: map
            });

            marker.addListener('click', function () {
                self.openInfoWindow(marker);
            });

            location.longname = longname;
            location.marker = marker;
            location.display = true;
            locations.push(location);
        });
        this.setState({
            'locations': locations
        });
    }

    openInfoWindow(marker) {
        this.closeInfoWindow();
        this.state.infowindow.open(this.state.map, marker);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
            'prevmarker': marker
        });
        this.state.infowindow.setContent('Loading Data...');
        this.state.map.setCenter(marker.getPosition());
        this.state.map.panBy(0, -200);
        this.getMarkerInfo(marker);
    }
getMarkerInfo(marker) {
        var self = this;
        var clientId = "HCLMJCLGOIS2IA4RVBUNUS1CNQ4KDQL1442HXKZSRTQWFQ2E";
        var clientSecret = "0M3GBQV2RVX2LHEE5LSMNMJYQQLY5NVJGAZNPR0I5OOPOWP2";
        var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
        fetch(url)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        self.state.infowindow.setContent("Sorry Map can't be loaded");
                        return;
                    }

                    response.json().then(function (data) {
                        var location_data = data.response.venues[0];
                        var name=location_data.name+ '<br>';
                        var address= location_data.location.address + '<br>';
                        var readMore = '<a href="https://foursquare.com/v/'+ location_data.id +'" target="_blank">Read More on Foursquare Website</a>'
                        self.state.infowindow.setContent(name+ address + readMore);
                    });
                }
            )
            .catch(function (err) {
                self.state.infowindow.setContent("Sorry data can't be loaded");
            });
    }

 closeInfoWindow() {
        if (this.state.prevmarker) {
            this.state.prevmarker.setAnimation(null);
        }
        this.setState({
            'prevmarker': ''
        });
        this.state.infowindow.close();
    }

   render() {
        return (
            <div>
                <div id="map"></div>
                 <PlacesList key={5} locations={this.state.locations} openInfoWindow={this.openInfoWindow}
                              closeInfoWindow={this.closeInfoWindow}/>
            </div>
        );
    }
}

export default App;

function loadMapJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = function () {
        document.write("Google Maps can't be loaded");
    };
    ref.parentNode.insertBefore(script, ref);
}