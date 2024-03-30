var map = new maptilersdk.Map({
  container: "map",
  zoom: 2.5,
  center: [78.9629, 20.5937],
  style: maptilersdk.MapStyle.DATAVIZ.LIGHT,
});

map.on("load", function () {
  map.addSource("campgrounds", {
    type: "geojson",
    data: campground,
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
  });

  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "campgrounds",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#9FA8DA",
        10,
        "#009688",
        20,
        "#FB8C00",
        50,
        "#FF6E40",
        100,
        "#C62828",
      ],
      "circle-radius": ["step", ["get", "point_count"], 20, 10, 30, 50, 40],
    },
  });

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "campgrounds",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
  });

  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "campgrounds",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#11b4da",
      "circle-radius": 9,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
    },
  });

  map.on("click", "clusters", function (e) {
    var features = map.queryRenderedFeatures(e.point, {
      layers: ["clusters"],
    });
    var clusterId = features[0].properties.cluster_id;
    map
      .getSource("campgrounds")
      .getClusterExpansionZoom(clusterId, function (err, zoom) {
        if (err) return;

        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
        });
      });
  });
  map.on("click", "unclustered-point", function (e) {
    var popText = e.features[0].properties.popuptext;
    console.log(popText);
    var coordinates = e.features[0].geometry.coordinates.slice();
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new maplibregl.Popup().setLngLat(coordinates).setHTML(popText).addTo(map);
  });
  map.on("mouseenter", "clusters", function () {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "clusters", function () {
    map.getCanvas().style.cursor = "";
  });
});
