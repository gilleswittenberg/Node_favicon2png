// requires
var fs = require('fs');
var path = require('path');
var favicon = require('favicon');
var wget = require('wget');
var imagemagick = require('imagemagick');

// settings
var cachedDir = path.join(__dirname, 'cached_images');
var defaultPNG = 'favicon.png';

// read setting
function getSetting (setting) {
  switch (setting) {
    case 'cachedDir':
      return cachedDir;
    case 'defaultPNG':
      return defaultPNG;
  }
}

// configure
function configure (config) {
  Object.keys(config).forEach(function (o) {
    switch (o) {
      case 'cachedDir':
        cachedDir = config[o];
        break;
      case 'defaultPNG':
        defaultPNG = config[o];
        break;
    }
  });
  return this;
}

var showDefault = function showDefault (callback) {
  fs.readFile(__dirname + '/' + defaultPNG, callback);
};

var readFile = function readFile (domainString, callback) {
  var filename;
  if (!domainString) {
    return showDefault(callback);
  }
  filename = cachedDir + '/' + domainString + '.png';
  fs.exists(filename, function (exists) {
    if (!exists) {
      favicon('http://' + domainString, function (err, faviconUrl) {
        // show default
        if (!faviconUrl) {
          return showDefault(callback);
        }
        var tmpFilename = __dirname + '/tmp/' + domainString + path.extname(faviconUrl);
        var download = wget.download(faviconUrl, tmpFilename);
        // show default
        download.on('error', function (err) {
          showDefault(callback);
        });
        download.on('end', function () {
          // create cachedDir if not exists
          fs.mkdir(__dirname + '/' + cachedDir, function (err) {
            imagemagick.convert(
              [tmpFilename, '-thumbnail', '16x16', '-flatten', filename],
              function (err, stdout){
                // remove tmp file
                process.nextTick(function () {
                  fs.unlink(tmpFilename);
                });
                // show default
                if (err) {
                  return showDefault(callback);
                }
                // show converted file
                fs.readFile(filename, callback);
              }
            );
          });
        });
      });
    } else {
      // show cached file
      fs.readFile(filename, callback);
    }
  });
};

// exports
exports.getSetting = getSetting;
exports.configure = configure;
exports.readFile = readFile;
