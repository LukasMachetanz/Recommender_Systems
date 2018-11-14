const fs = require("fs");

const gpsData = JSON.parse(
  fs.readFileSync("data/run_00.json")
);

let fullDist = gpsData[gpsData.length - 1].distance;
console.log(`Volle Distanz: ${fullDist}m`);