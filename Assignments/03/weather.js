const fs = require("fs");

// https://www.npmjs.com/package/openweathermap-node
const openWeatherMap = require("openweathermap-node");

/**
 *
 * Datenbasis GPS: -- Wetter (openweathermap)
 *
 */

const GPS_DATA = JSON.parse(
	fs.readFileSync("data/run_01.json")
);

const openWeatherMapHelper = new openWeatherMap({
	APPID: '824aa6fc7f93f35274a6d0b747e925ac',
	units: "imperial"
});

// === === === === === === === === === === === === === === === === === === === ===
// === === === === === === === === === === === === === === === === === === === ===

const getWeather = (GPSData) => {
	return new Promise((resolve, reject) => {
		openWeatherMapHelper.getCurrentWeatherByGeoCoordinates(GPSData[0].latitude, GPSData[0].longitude, (error, currentWeather) => {
			if (error) {
				reject(error);
			}
			
			resolve(currentWeather);
		});
	});
};


getWeather(GPS_DATA)
	.then(data => {
		console.log("QUERY WEATHER SUCCESS");
		console.log(data);
	})
	.catch(error => {
		console.log(error);
	});

// === === === === === === === === === === === === === === === === === === === ===
// === === === === === === === === === === === === === === === === === === === ===