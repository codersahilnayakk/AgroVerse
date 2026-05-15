const fs = require('fs');
const path = require('path');

const sourceDir = 'C:\\Users\\sahil nayak\\.gemini\\antigravity\\brain\\ffb2f9ce-abe0-4cac-a83e-20f08d93c143';
const targetDir = path.join(__dirname, 'frontend', 'public', 'img', 'crops');

const map = {
  'cotton': 'crop_cotton_',
  'groundnut': 'crop_groundnut_',
  'maize': 'crop_maize_',
  'mustard': 'crop_mustard_',
  'pearl-millet': 'crop_pearl_millet_',
  'rice': 'crop_rice_',
  'soybean': 'crop_soybean_',
  'sugarcane': 'crop_sugarcane_',
  'wheat': 'crop_wheat_'
};

const files = fs.readdirSync(sourceDir);

for (const [targetName, prefix] of Object.entries(map)) {
  const file = files.find(f => f.startsWith(prefix) && f.endsWith('.png'));
  if (file) {
    fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, `${targetName}.png`));
    console.log(`Copied ${file} to ${targetName}.png`);
  } else {
    console.log(`Not found for ${targetName}`);
  }
}
