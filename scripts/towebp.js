// Usage: node scripts/towebp.js <input> <output> <width> <height> [quality]
const sharp = require('sharp');
const [, , input, output, width, height, quality] = process.argv;
sharp(input)
  .resize(parseInt(width), parseInt(height), { fit: 'cover' })
  .webp({ quality: quality ? parseInt(quality) : 85 })
  .toFile(output)
  .then(() => console.log('saved', output))
  .catch(e => { console.error(e); process.exit(1); });
