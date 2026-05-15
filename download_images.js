const fs = require('fs');
const path = require('path');
const https = require('https');

// Use https native but follow redirects manually
function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    };
    
    const request = https.get(url, options, (response) => {
      // Check if redirect
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        console.log(`Redirecting to ${response.headers.location}`);
        file.close();
        download(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

const crops = {
  'cotton.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Cotton_Plant.JPG/800px-Cotton_Plant.JPG',
  'soybean.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Soybean.USDA.jpg/800px-Soybean.USDA.jpg',
  'maize.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Corn_plant.jpg/800px-Corn_plant.jpg',
  'wheat.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/p/p4/Wheat_close-up.JPG/800px-Wheat_close-up.JPG',
  'rice.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Rice_plant.jpg/800px-Rice_plant.jpg',
  'groundnut.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Peanut_9417.jpg/800px-Peanut_9417.jpg',
  'sugarcane.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Sugarcane_in_a_field.jpg/800px-Sugarcane_in_a_field.jpg',
  'mustard.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Mustard_field_in_Punjab.jpg/800px-Mustard_field_in_Punjab.jpg',
  'pearl-millet.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Pennisetum_glaucum.jpg/800px-Pennisetum_glaucum.jpg'
};

const dir = path.join(__dirname, 'frontend', 'public', 'img', 'crops');

async function downloadAll() {
  for (const [filename, url] of Object.entries(crops)) {
    try {
      console.log(`Downloading ${filename}...`);
      await download(url, path.join(dir, filename));
      console.log(`Successfully downloaded ${filename}`);
    } catch (err) {
      console.error(`Error with ${filename}: ${err.message}`);
    }
  }
}

downloadAll();
