const sharp = require('sharp');

async function run() {
  const width = 1200;
  const height = 630;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots" width="40" height="38" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="19" r="1.25" fill="white" fill-opacity="0.05" />
        </pattern>
      </defs>
      <rect width="${width}" height="${height}" fill="#020c45" />
      <rect width="${width}" height="${height}" fill="url(#dots)" />
      <rect x="0" y="0" width="${width}" height="6" fill="#8b0a32" />
      <text x="600" y="368" font-family="Arial, sans-serif" font-size="54" font-weight="800" fill="#ffffff" text-anchor="middle">Frontier Quotient</text>
      <text x="600" y="418" font-family="Arial, sans-serif" font-size="22" font-weight="500" fill="#f3d9e2" text-anchor="middle" letter-spacing="1">STRATEGIC FINANCE FOR THE GULF'S MOST AMBITIOUS OPERATORS</text>
    </svg>
  `;

  // Crop just the icon mark from the raw logo (same crop used for the
  // favicon) and place it above the wordmark.
  const iconSize = 140;
  const icon = await sharp('assets/images/logo-navbar-raw.png')
    .extract({ left: 650, top: 1580, width: 900, height: 900 })
    .resize(iconSize, iconSize)
    .toBuffer();

  await sharp(Buffer.from(svg))
    .composite([{ input: icon, left: Math.round(width / 2 - iconSize / 2), top: 140 }])
    .resize(width, height)
    .jpeg({ quality: 88 })
    .toFile('assets/images/og-default.jpg');

  console.log('OG image generated');
}
run().catch(e => { console.error(e); process.exit(1); });
