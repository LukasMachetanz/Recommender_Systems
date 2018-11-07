const fs = require("fs");

/**
 *
 * Datenbasis: Runtastic -- Durchschnittliche Steigung nach unten: 1/n Sum_1^n Negative Elevation in Segment/(dist(Segment Start,Segment End))
 *
 */


const GPS_DATA = JSON.parse(
  fs.readFileSync("data/run_01.json")
);


const transformToSegments = GPSData => {
  const segments = [];

  for (let i = 1; i < GPSData.length; i++) {
    const distance = GPSData[i].distance - GPSData[i - 1].distance;
    const elevationLoss = GPSData[i].elevation_loss - GPSData[i - 1].elevation_loss;
    segments.push({ distance, elevationLoss });
  }

  return segments;
};


const calculateAverageSlopeDownwards = GPSData => {
	const segments = transformToSegments(GPSData);
	
	const sum = segments.reduce((sum, segment) => {
		return segment.distance === 0 ? sum : sum + segment.elevationLoss / segment.distance;
	}, 0);
	
	return (1 / segments.length) * sum;
};


console.log("averageSlopeDownwards", calculateAverageSlopeDownwards(GPS_DATA));


