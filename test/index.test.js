var should = require('should');
var fs = require('fs');
var path = require('path');
var favicon2Image;

// start with a clean module
beforeEach(function () {
  delete require.cache[require.resolve(__dirname + '/../')];
  favicon2Image = require(__dirname + '/../');
});

describe("getSetting default cachedDir", function () {
  it("get cachedDir", function (done) {
    favicon2Image.getSetting('cachedDir').should.eql(path.join(__dirname, '../cached_images'));
    done();
  });
  it("get defaultPNG", function (done) {
    favicon2Image.getSetting('defaultPNG').should.eql('favicon.png');
    done();
  });
});

describe("configure", function () {
  it("sets cachedDir using configure method", function (done) {
    favicon2Image.configure({cachedDir: 'dir_name', defaultPNG: 'default.png'});
    favicon2Image.getSetting('cachedDir').should.eql('dir_name');
    favicon2Image.getSetting('defaultPNG').should.eql('default.png');
    done();
  });
});

describe("empty string domain", function () {
  it("return default PNG", function (done) {
    favicon2Image.readFile('', function (err, img) {
      fs.readFile(__dirname + '/../favicon.png', function (errExpected, imgExpected) {
        img.should.eql(imgExpected);
        done();
      });
    });
  });
});


describe("invalid domain", function () {
  it("return default PNG", function (done) {
    favicon2Image.readFile('invalid-domain', function (err, img) {
      fs.readFile(__dirname + '/../favicon.png', function (errExpected, imgExpected) {
        img.should.eql(imgExpected);
        done();
      });
    });
  });
});

describe("nonexisting domain/favicon", function () {
  it("return default PNG", function (done) {
    favicon2Image.readFile('www.nonexistingabcdefghijklmnopqrstuvwxyz', function (err, img) {
      fs.readFile(__dirname + '/../favicon.png', function (errExpected, imgExpected) {
        img.should.eql(imgExpected);
        done();
      });
    });
  });
});

describe("convert on non cached icon", function () {
  it("not return default PNG", function (done) {
    // remove cached file
    var path = __dirname + '/../cached_images/www.github.com.png';
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
    // check if converted file is returned
    favicon2Image.readFile('www.github.com', function (err, img) {
      fs.readFile(__dirname + '/../favicon.png', function (errExpected, imgExpected) {
        img.should.not.eql(imgExpected);
        done();
      });
    });
  });
});

describe("show cached icon", function () {
  it("not return default PNG", function (done) {
    // check if cached file exists
    var path = __dirname + '/../cached_images/www.github.com.png';
    fs.exists(path, function (exists) {
      exists.should.be.true;
      // check if cached file is returned
      favicon2Image.readFile('www.github.com', function (err, img) {
        fs.readFile(path, function (errExpected, imgExpected) {
          img.should.eql(imgExpected);
          done();
        });
      });
    });
  });
});
