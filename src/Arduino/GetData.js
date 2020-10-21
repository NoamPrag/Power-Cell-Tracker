const fs = require("fs");
const path = require("path");

const rawData = fs.readFileSync(path.resolve("./src/Arduino/Coords.json"));
export const parsed = JSON.parse(rawData);
