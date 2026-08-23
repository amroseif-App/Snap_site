const fs = require("fs");
const path = require("path");

const mediaCounts = {
  "fouka-bay-phase-1": 4,
  "monti-galala-chs": 6,
  "the-shore": 11,
  "the-view": 5,
  "astoria": 8,
  "montaza-quatro-mall": 4,
  "katamia": 6,
  "porto-new-cairo-archive": 4,
  "porto-6-october": 4,
  "royal-beach": 4,
  "grand-heights": 4,
  "jeera": 4
};

const hiddenNearDuplicates = {
  "katamia": new Set([4, 5]),
  "the-shore": new Set([2, 3, 4, 5, 11]),
  "the-view": new Set([3])
};

const root = path.resolve(__dirname, "..");
const jsonPath = path.join(root, "data", "projects.json");
const jsPath = path.join(root, "data", "projects-data.js");
const projects = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

for (const project of projects) {
  const count = mediaCounts[project.id];
  if (!count) continue;
  const base = `images/portfolio/${project.id}/ai-2026`;
  project.image = `${base}/01.jpeg`;
  const hidden = hiddenNearDuplicates[project.id] || new Set();
  project.gallery = Array.from({ length: count }, (_, index) => index + 1)
    .filter(number => !hidden.has(number))
    .map(number => `${base}/${String(number).padStart(2, "0")}.jpeg`);
}

const json = `${JSON.stringify(projects, null, 2)}\n`;
fs.writeFileSync(jsonPath, json, "utf8");
fs.writeFileSync(jsPath, `window.SNAP_PROJECTS = ${json.trimEnd()};\n`, "utf8");

console.log(`Linked NEW- AI media to ${Object.keys(mediaCounts).length} projects.`);
