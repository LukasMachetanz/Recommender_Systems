const fs = require("fs");

const gpsData = JSON.parse(fs.readFileSync("data/run_00.json"));

function transformToElevations(gpsData) {
  const elevations = [];
  for (let i = 1; i < gpsData.length; i += 1) {
    const elevGain = gpsData[i].elevation_gain - gpsData[i - 1].elevation_gain;
    const elevLoss = gpsData[i].elevation_loss - gpsData[i - 1].elevation_loss;
    elevations.push({ elevGain, elevLoss});
  }
  return elevations;
};

const elevs = transformToElevations(gpsData);
elevs.sort(function(a,b) {
    return a.elevGain - b.elevGain;
});

var current = null;
var cnt = 0;
let freq_gain = [];
for (var i = 0; i < elevs.length; i++) {
    if (elevs[i].elevGain != current) {
        if (cnt > 0) {
            freq_gain.push({ gain: current, freq: cnt});
        }
        current = elevs[i].elevGain;
        cnt = 1;
    } else {
        cnt++;
    }
}
if (cnt > 0) {
    freq_gain.push({ gain: current, freq: cnt});
}
console.log("Frequenz für Elevation Gain: ");
console.log(freq_gain);

elevs.sort(function(a,b) {
    return a.elevLoss - b.elevLoss;
});

var current = null;
var cnt = 0;
let freq_loss = [];
for (var i = 0; i < elevs.length; i++) {
    if (elevs[i].elevLoss != current) {
        if (cnt > 0) {
            freq_loss.push({ loss: current, freq: cnt});
        }
        current = elevs[i].elevLoss;
        cnt = 1;
    } else {
        cnt++;
    }
}
if (cnt > 0) {
    freq_loss.push({ loss: current, freq: cnt});
}
console.log("Frequenz für Elevation Loss: ");
console.log(freq_loss);
