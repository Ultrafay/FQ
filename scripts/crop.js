// Usage: node scripts/crop.js <input> <output> <top> <height> [width=1440]
const sharp = require('sharp');
const [, , input, output, top, height, width] = process.argv;
sharp(input)
  .extract({ left: 0, top: parseInt(top), width: parseInt(width || '1440'), height: parseInt(height) })
  .toFile(output)
  .then(() => console.log('saved', output))
  .catch(e => { console.error(e); process.exit(1); });
