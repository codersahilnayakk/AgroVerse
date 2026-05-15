const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\sahil nayak\\.gemini\\antigravity\\brain\\ffb2f9ce-abe0-4cac-a83e-20f08d93c143';
const destDir = 'C:\\Users\\sahil nayak\\Desktop\\AgriConnect (2)\\AgriConnect\\frontend\\public\\img\\schemes';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const images = [
  { prefix: 'pm_kisan_', destName: 'pm_kisan.png' },
  { prefix: 'pmfby_', destName: 'pmfby.png' },
  { prefix: 'soil_health_', destName: 'soil_health.png' },
  { prefix: 'kisan_credit_', destName: 'kisan_credit.png' },
  { prefix: 'pmksy_', destName: 'pmksy.png' },
  { prefix: 'pkvy_', destName: 'pkvy.png' },
  { prefix: 'livestock_', destName: 'livestock.png' },
  { prefix: 'agri_infra_', destName: 'agri_infra.png' },
];

const files = fs.readdirSync(srcDir);

images.forEach(img => {
  const match = files.find(f => f.startsWith(img.prefix) && f.endsWith('.png'));
  if (match) {
    fs.copyFileSync(path.join(srcDir, match), path.join(destDir, img.destName));
    console.log(`Copied ${match} to ${img.destName}`);
  } else {
    console.log(`Could not find file starting with ${img.prefix}`);
  }
});

console.log("Finished copying images!");
