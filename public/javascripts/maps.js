/*
 * maps.js
 * Copyright (C) 2022 matthew <matthew@WINDOWS-05HIC4F>
 *
 * Distributed under terms of the MIT license.
 */
(function () {
  "use strict";
  let lookup = (text, callback) => {
    // https://photon.komoot.io/api/?q=chicago&osm_tag=place:city&lat=52.3879&lon=13.0582
    $.get(
      "https://photon.komoot.io/api/?q=" +
        text +
        "&osm_tag=place:city&lat=52.3879&lon=13.0582"
    ).done((json) => {
      console.log(json);
      let obj = {
        name: json.features[0].properties.name,
        lat: json.features[0].geometry.coordinates[1],
        lon: json.features[0].geometry.coordinates[0],
        country: json.features[0].properties.countrycode,
      };
      callback(obj);
    });
  };
  $('#search_bar').keyup((e) => {
    lookup(e.target.value, (e) => {
      console.log(e);
    });
  });
})();
