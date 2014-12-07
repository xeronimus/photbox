var
  winston = require('winston'),
  Q = require('q'),
  _ = require('lodash'),
  settings = require('../settings');


var LOGGER = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({level: settings.logging.level})]
});


var GPhoto = getGPhotoInstance();
var cam;


function getGPhotoInstance() {
  var gPhotoLib;
  if (settings.useMockGphoto) {
    gPhotoLib = require('./mock/mockGphoto2');
    LOGGER.info('Using mock GPhoto2 instance! Configure "useMockGphoto" in settings.js!')
  } else {
    gPhotoLib = new require('gphoto2');
  }
  return new gPhotoLib.GPhoto2();
}

/**
 *  lists all available cams and picks the first one.
 *  if no cam is available, promise is rejected
 */
function connectCam() {
  var deferred = Q.defer();
  GPhoto.list(function (list) {
    if (list.length === 0) {
      LOGGER.error('No camera found...');
      deferred.reject('No camera found...');
    } else {
      cam = list[0];
      LOGGER.info('Found %s at port %s', cam.model, cam.port);
      deferred.resolve({status: 'OK', model: cam.model, port: cam.port, allCams: list});
    }
  });
  return deferred.promise;
}


function take() {
  var deferred = Q.defer();
  if (_.isUndefined(cam)) {
    LOGGER.error('No camera ready. Did you start() correctly?');
    deferred.reject();
    return deferred.promise;
  }
  LOGGER.debug('Taking picture...');

  cam.takePicture({download: true}, function (err, data) {
    if (err) {
      LOGGER.error('Could not take picture', err, data);
      deferred.reject(err);
      return deferred.promise;
    }
    deferred.resolve(data);
  });

  return deferred.promise;
}

/**
 *  returns status about connected cam, if any
 */
function status() {
  var deferred = Q.defer();
  if (_.isUndefined(cam)) {
    deferred.resolve({status: 'NO_CAM'});
  } else {
    GPhoto.list(function (list) {
      if (list.length > 0) {
        deferred.resolve({status: 'OK', model: cam.model, port: cam.port, allCams: list});
      } else {
        deferred.resolve({status: 'DISCONNECTED', model: cam.model, port: cam.port, allCams: list});
      }
    });
  }
  return deferred.promise;
}

module.exports = {
  connectCam: connectCam,
  take: take,
  status: status
};
