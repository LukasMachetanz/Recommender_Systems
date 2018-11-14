const fs = require("fs");

const gpsData = JSON.parse(
  // GPS data file from Runtastic
  fs.readFileSync("data/run_00.json")
);

const transformToSegments = gpsData => {
  const segments = [];

  for (let i = 1; i < gpsData.length; i += 1) {
    const distance = gpsData[i].distance - gpsData[i - 1].distance;
    const elevationGain =
      gpsData[i].elevation_gain - gpsData[i - 1].elevation_gain;

    segments.push({ distance, elevationGain });
  }

  return segments;
};

const segments = transformToSegments(gpsData);

const averageSlopeUpwards =
  (1 / segments.length) *
  segments.reduce((sum, segment) => {
    if (segment.distance === 0) {
      return sum;
    }

    return sum + segment.elevationGain / segment.distance;
  }, 0);

console.log(averageSlopeUpwards);
