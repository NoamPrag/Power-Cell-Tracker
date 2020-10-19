const fs = require("fs");
const path = require("path");

const rawData = fs.readFileSync(path.resolve("./src/Arduino/Coords.json"));
const parsed = JSON.parse(rawData);
console.log(parsed.bursts);

module.exports = {
  data: parsed.bursts,
};
