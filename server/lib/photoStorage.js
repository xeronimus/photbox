var
  moment = require('moment'),
  winston = require('winston'),
  Q = require('q'),
  fs = require('fs'),
  path = require('path'),
  settings = require('../settings');


var LOGGER = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({level: settings.logging.level})]
});

var imageStoreLocation = path.resolve(settings.storage);

function getNewPhotoFilename() {
  return 'pic_' + moment().format('YYYY_MM_DD_HH_mm_ss') + '.jpg';
}

function storePicture(data) {
  var deferred = Q.defer();
  var fileName = getNewPhotoFilename();
  var filePath = path.join(imageStoreLocation, fileName);
  LOGGER.info('Got picture, saving to ' + filePath);
  fs.writeFile(filePath, data, function (err) {
    if (err) {
      LOGGER.error('Could not save!');
      deferred.reject(err);
      return;
    }
    LOGGER.info('Picture saved');
    deferred.resolve({fileName: fileName, filePath: filePath});
  });

  return deferred.promise;
}

function listStoredPictures() {
  var deferred = Q.defer();
  fs.readdir(imageStoreLocation, function (err, files) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(files);
    }
  });
  return deferred.promise;
}

module.exports = {
  storePicture: storePicture,
  listStoredPictures: listStoredPictures
};
