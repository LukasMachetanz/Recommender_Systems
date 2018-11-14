const fs = require("fs");
const queryOverpass = require("query-overpass");

const gpsData = JSON.parse(
  fs.readFileSync("data/run_00.json")
);

let fullDist = gpsData[gpsData.length - 1].distance;

let distPrev = 0;
const distribution = [];
const promises = [];

const buildQuery = gps => {
    // gather results
    return `
    [out:json][timeout:10000];
    (
        way[\"highway\"](around:50.0,${gps.latitude},${gps.longitude});
    );
    out body;
    >;
    out skel qt;
  `;
};

for (let gps in gpsData) {
  if (gps % 50 === 0 || gps == (gpsData.length-1)) {

    promises.push(new Promise((resolve, reject) => {

      setTimeout(() => {
          queryOverpass(buildQuery(gpsData[gps]), (error, data) => {
              if (error || data.features[0] === undefined) {
                  reject(error);
              } else {
                  resolve({
                      id : gps,
                      streetType : data.features[0].properties.tags.highway,
                      distance : gpsData[gps].distance
                  });
              }
          });
      }, 1000 * (gps/25));
    }));
  }
}


Promise.all(promises)
    .then(values => {
      // console.log(values);

      for(let value in values) {
        let dist = values[value].distance - distPrev;

        (distribution[values[value].streetType] !== undefined) ? distribution[values[value].streetType] += dist : distribution[values[value].streetType] = dist;
        distPrev = values[value].distance;
      }
      // console.log(distribution);
      for (let type in distribution) {
        console.log(`${type} : ${Math.round(distribution[type] / fullDist * 10000)/100}%`)
      }
    }).catch((err) => {
      console.log(err);
    });
