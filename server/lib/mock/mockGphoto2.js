var
  fs = require('fs'),
  path = require('path');


//
var shouldReturnCam = true;
var shouldReturnPicture = true;

var pictureData = fs.readFileSync(path.join(__dirname, './mockPicture.jpg'));

var dummyCam = {
  model: 'SuperMockCam',
  port: 'usb3',
  takePicture: function (options, callback) {
    if (shouldReturnPicture) {
      callback(null, pictureData);
    } else {
      callback(new Error('could not get picture'));
    }
  }
};


function GPhoto2() {

}


GPhoto2.prototype.list = function (callback) {
  if (shouldReturnCam) {
    callback([dummyCam]);
  } else {
    callback([]);
  }
};

module.exports = {
  GPhoto2: GPhoto2
};