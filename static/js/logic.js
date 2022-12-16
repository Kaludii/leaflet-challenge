// Earthquake data link
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(link, function(eq_reply) {
  Generate(eq_reply.features);
});

function Generate(data) {
  function onEachFeature(feature, layer) {
    layer.bindPopup(
      "<h2>" + feature.properties.place + "</h2>" + new Date(feature.properties.time) + ""
    );
  }

  function onEachMarker(feature, latlng) {
    return new L.Circle(latlng, {
      radius: markerSize(feature.properties.mag),
      fillOpacity: 0.6,
      color: colors(feature.properties.mag),
      fillColor: colors(feature.properties.mag)
    });
  }

  function markerSize(eq_magnitude) {
    return Math.exp(eq_magnitude) * 1000;
  }

  var earthquakes = L.geoJSON(data, {
    onEachFeature: onEachFeature,
    pointToLayer: onEachMarker
  });
  map(earthquakes);
}

function colors(eq_magnitude) {
  switch (true) {
    case eq_magnitude > 10:
      color = "#ff3300";
      break;
    case eq_magnitude > 8:
      color = "#ff6f00";
      break;
    case eq_magnitude > 7:
      color = "#ff8c00";
      break;
    case eq_magnitude > 6:
      color = "#ffae00";
      break;
    case eq_magnitude > 5:
      color = "#ffd000";
      break;
    case eq_magnitude > 4:
      color = "#fbff00";
      break;
    case eq_magnitude > 3:
      color = "#d4ff00";
      break;
    case eq_magnitude > 2:
      color = "#b3ff00";
      break;
    case eq_magnitude > 1:
      color = "#77ff00";
      break;
    case eq_magnitude <= 1:
      color = "#00ff4c";
      break;
  }
  return color;
}


var overlays = {
  Earthquakes: earthquakes
};

function map(earthquakes) {
  // streets, grayscale, and outdoors tile layers
  var satellite_map = L.tileLayer(
    "https://api.tiles.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
      "&#169; <a href='https://www.mapbox.com/'>Mapbox</a> &#169; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> <strong><a href='https://docs.mapbox.com/help/troubleshooting/mapbox-gl-js-performance/'>Improve this map</a></strong>",
      maxZoom: 25,
      id: "mapbox/satellite-streets-v11",
      accessToken: API_KEY
    }
  );

  var street_map = L.tileLayer(
    "https://api.tiles.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        "&#169; <a href='https://www.mapbox.com/'>Mapbox</a> &#169; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> <strong><a href='https://docs.mapbox.com/help/troubleshooting/mapbox-gl-js-performance/'>Improve this map</a></strong>",
      maxZoom: 25,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    }
  );

  var grayscale_map = L.tileLayer(
    "https://api.tiles.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        "&#169; <a href='https://www.mapbox.com/'>Mapbox</a> &#169; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> <strong><a href='https://docs.mapbox.com/help/troubleshooting/mapbox-gl-js-performance/'>Improve this map</a></strong>",
      maxZoom: 25,
      id: "mapbox/light-v10",
      accessToken: API_KEY
    }
  );
  
  var mainMaps = {
    "Streets": street_map,
    "Grayscale": grayscale_map,
    "Satellite": satellite_map
  };

  var overlays = {
    Earthquakes: earthquakes
  };
  
  // Map
  var map = L.map("map", {
    center: [37.5, -98.35],
    zoom: 4,
    layers: [street_map, earthquakes]
  });
  
  L.control.layers(mainMaps, overlays, { collapsed: false }).addTo(map);
  
  var legend = L.control({ position: "bottomright" });
  
  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "info legend"),
      grades = ["#00ff4c", "#b3ff00", "#fbff00", "#ffae00", "#ff6f00", "#ff3300"],
      labels = ["0-1", "1-3", "3-5", "5-7", "7-10", "10+"];
  
    div.innerHTML = "<div><h4>Legend</h4></div>";

      // loops through intervals
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML += `<i style='background:${grades[i]}'>&nbsp;&nbsp;</i>&nbsp;&nbsp;${labels[i]}<br/>`;
      }
      return div;
    }
    legend.addTo(map);
  }