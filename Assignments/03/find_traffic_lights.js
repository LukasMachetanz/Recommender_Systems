const fs = require("fs");
const queryOverpass = require("query-overpass");

const gpsData = JSON.parse(
  // GPS data file from Runtastic
  fs.readFileSync("data/run_00.json")
);

const buildQuery = gpsData => {
  // 'around' searches for Nodes in x meters.
  const nodes = gpsData.map(
    item =>
      `node[crossing=traffic_signals](around:20.0,${item.latitude},${
        item.longitude
      });`
  );

  return `
    [out:json][timeout:25];
    (
        ${nodes.join("")}
    );
    out body;
  `;
};

queryOverpass(buildQuery(gpsData), (error, data) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log(data);
});
