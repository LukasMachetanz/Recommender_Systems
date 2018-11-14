const fs = require("fs");
const queryOverpass = require("query-overpass");

const gpsData = JSON.parse(
  fs.readFileSync("data/run_00.json")
);


const buildQuery = gpsData => {
  // query part for: “shop=supermarket”
  const nodes = gpsData.map(
    item =>
     `way[\"shop\"=\"supermarket\"](around:200.0,${item.latitude},${item.longitude});node[\"shop\"=\"supermarket\"](around:200.0,${item.latitude},${item.longitude});`
  );
    // gather results
  return `
    [out:json][timeout:10000];
    (
        ${nodes.join("")}
    );
    out body;
    >;
    out skel qt;
  `;
};

queryOverpass(buildQuery(gpsData), (error, data) => {
  if (error) {
    console.error(error);
    return;
  }
  // print results
  // console.log(data);
  console.log(`Es wurden ${data.features.length} Geschäfte gefunden.`);
});
