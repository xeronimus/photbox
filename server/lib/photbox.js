var gphoto2 = require('gphoto2'),
    Q = require('q'),
    _ = require('lodash'),
    moment = require('moment'),
    fs = require('fs'),
    path = require('path');
var GPhoto = new gphoto2.GPhoto2();

var imageStoreLocation = path.resolve(__dirname + '/../photos/');
var cam;


/**
 *  lists all available cams and picks the first one.
 *  if no cam is available, promise is rejected
 */
function connectCam() {
    var deferred = Q.defer();
    GPhoto.list(function (list) {
        if (list.length === 0) {
            console.error('No camera found...');
            deferred.reject();
            return;
        }
        cam = list[0];
        console.log('Found ' + cam.model + ' at port ' + cam.port);
        deferred.resolve({status: 'OK', model: cam.model, port: cam.port, allCams: list});
    });
    return deferred.promise;
}

function take() {
    var deferred = Q.defer();
    if (_.isUndefined(cam)) {
        console.error('No camera ready. Did you start() correctly?');
        deferred.reject();
        return;
    }
    console.log('taking picture...');
    cam.takePicture({download: true}, function (err, data) {
        if (err) {
            console.log('could not take picture',err,data);
            deferred.reject(err);
            return;
        }
        var fileName = getNewPhotoFilename();
        var filePath = path.join(imageStoreLocation, fileName);
        console.log('got picture, saving to ' + filePath);
        fs.writeFile(filePath, data, function (err) {
            if (err) {
                deferred.reject(err);
                return;
            }
            console.log('picture saved');
            deferred.resolve({fileName: fileName, filePath: filePath});
        });
    });
    return deferred.promise;
}

function getNewPhotoFilename() {
    return 'pic_' + moment().format('YYYY_MM_DD_HH_mm_ss') + '.jpg';
}

/**
 *  returns status about connected cam, if any
 *  returns promise in order to be constistent with the api
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