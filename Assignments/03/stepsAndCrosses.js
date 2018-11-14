const fs = require("fs");
const queryOverpass = require("query-overpass");

/**
 * Datenbasis: GPS: -- Anzahl Strassenüberquerungen
 *
 * Datenbasis: GPS: -- % Stufen
 *
 */


const GPS_DATA = JSON.parse(
  fs.readFileSync("data/run_00.json")
);


// === === === === === === === === === === === === === === === === === === === ===
// === === === === === === === === === === === === === === === === === === === ===

const buildQuery = (queryPart, GPSData, radius, timeout) => {
  const nodes = GPSData.map(dataPoint => `${ queryPart }(around:${ radius },${ dataPoint.latitude },${ dataPoint.longitude });`);

  return `
    [out:json][timeout:${ timeout }];
    (
        ${ nodes.join("") }
    );
    out body;
    >;
    out skel qt;
  `;
};


const queryFor = (queryPart, GPSData, radius, timeout) => {
	return new Promise((resolve, reject) => {
		queryOverpass(buildQuery(queryPart, GPSData, radius, timeout), (error, data) => {
			if (error) {
				reject(error);
			}
			
			resolve(data);
		});
	});
};

// === === === === === === === === === === === === === === === === === === === ===
// === === === === === === === === === === === === === === === === === === === ===

const getAmountOfCrosses = (GPSData, radius = 1.0, timeout = 1000) => {
	const queryPart = `node[\"highway\"=\"crossing\"]`;
	queryFor(queryPart, GPSData, radius, timeout)
		.then(({ features }) => {
			console.log("Amount of crosses: ", features.length);
		})
		.catch((error) => {
			console.log("ERROR", error);
		});
};


getAmountOfCrosses(GPS_DATA);

// === === === === === === === === === === === === === === === === === === === ===
// === === === === === === === === === === === === === === === === === === === ===

const getPercentOfSteps = (GPSData, radius = 1.0, timeout = 1000) => {
	const queryPart = `node[\"highway\"=\"steps\"]`;
	queryFor(queryPart, GPSData, radius, timeout)
		.then(({ features }) => {
			console.log('Percentage of steps: ', features.length / GPSData.length );
		})
		.catch((error) => {
			console.log("ERROR", error);
		});
};


getPercentOfSteps(GPS_DATA);

// === === === === === === === === === === === === === === === === === === === ===
// === === === === === === === === === === === === === === === === === === === ===
