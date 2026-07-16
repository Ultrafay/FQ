const sharp = require('sharp');
sharp('assets/images/logo-navbar-raw.png').metadata().then(m => console.log(m));
