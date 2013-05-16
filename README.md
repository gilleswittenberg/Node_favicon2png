#Node.js Favicon2PNG

Get favicon from domain. Convert to PNG

## Usage

var favicon2PNG = require('favicon2PNG');
favicon2PNG.readFile('www.github.com', function (err, data) {
  if (err) throw err;
  // use data
});

## Dependencies
imagemagick
favicon (use fork https://github.com/gilleswittenberg/node-favicon for better results)
wget
