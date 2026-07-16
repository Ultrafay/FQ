const sharp = require('sharp');
const src = 'assets/images/logo-navbar-raw.png';

async function run() {
  const cropped = await sharp(src)
    .extract({ left: 650, top: 1580, width: 900, height: 900 })
    .png()
    .toBuffer();

  await sharp(cropped).resize(64, 64).png().toFile('assets/images/favicon-64.png');
  await sharp(cropped).resize(32, 32).png().toFile('assets/images/favicon-32.png');
  console.log('favicon done');
}
run().catch(e => { console.error(e); process.exit(1); });
