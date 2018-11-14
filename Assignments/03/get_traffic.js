const fs = require("fs");
const queryOverpass = require("query-overpass");

const gpsData = JSON.parse(
  // GPS data file from Runtastic
  fs.readFileSync("data/f97f488e-6f95-45bd-87b5-babf99419c3d.json")
);

const getBoundingRect = gpsData => {
  let top = 0;
  let right = 0;
  let bottom = Infinity;
  let left = Infinity;

  gpsData.forEach(item => {
    top = Math.max(top, item.latitude);
    right = Math.max(right, item.longitude);
    bottom = Math.min(bottom, item.latitude);
    left = Math.min(left, item.longitude);
  });

  return { top, right, bottom, left };
};

const buildQuery = gpsData => {
  // 'around' searches for Nodes in x meters.
  const nodes = gpsData.map(
    item => `way
    [highway~"^(primary|secondary|tertiary|residential|pedestrian)$"]
    [name](around:10.0,${item.latitude},${item.longitude});`
  );

  return `
    [out:json][timeout:25];
    (
        ${nodes.join("")}
    );
    (._;>;);
    out body;
  `;
};

const getStreetNames = data => {
  const names = data.features
    .map(item => item.properties.tags.name)
    .filter(item => item !== undefined);

  return names.filter((item, index) => names.indexOf(item) === index);
};

queryOverpass(buildQuery(gpsData), (error, data) => {
  if (error) {
    console.error(error);
    return;
  }

  const streetNames = getStreetNames(data);

  console.log(streetNames);
});
