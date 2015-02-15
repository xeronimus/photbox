'use strict';

var
  express = require('express'),
  photbox = require('./photbox'),
  photoStorage = require('./photoStorage'),
  path = require('path'),
  responseHandler = require('./responseHandler'),
  settings = require('../settings'),
  socketServer = require('./socketServer');

var app = express();


// serve the photbox client
app.use(express.static(path.join(__dirname, '../../client/dist')));

// serve the photo storage folder
app.use('/photos', express.static(path.resolve(settings.storage)));

/**
 * CORS support.
 */
app.all('*', function (req, res, next) {
  if (!req.get('Origin')) {
    return next();
  }
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  if (req.method === 'OPTIONS') {
    return res.send(200);
  }
  next();
});

/**
 * triggers the cam to take a photo, saves it and returns the name
 * of the new photo
 */
app.get('/api/photo', function (req, res) {

  function sendError(err) {
    responseHandler.error(err, res);
  }

  photbox.take()
    .then(function (pictureData) {
      photoStorage.storePicture(pictureData)
        .then(function (result) {
          socketServer.broadcastNewImage(result);
          responseHandler.success(result, res);
        }, sendError);
    }, sendError);
});

/**
 * returns a list of all saved photos
 */
app.get('/api/list', function (req, res) {
  photoStorage.listStoredPictures()
    .then(function (result) {
      responseHandler.success(result, res);
    }, function (err) {
      responseHandler.error(err, res);
    })
});

/**
 * connects the cam.
 * this is used if the server was started, before the cam was connected to the USB port.
 */
app.get('/api/connect', function (req, res) {
  photbox.connectCam().then(function (result) {
    responseHandler.success(result, res);
  }, function (err) {
    responseHandler.error(err, res, 503);
  });
});

/**
 * returns status information about the connected cam, if any.
 */
app.get('/api/status', function (req, res) {
  photbox.status().then(function (result) {
    responseHandler.success(result, res);
  }, function (err) {
    responseHandler.error(err, res);
  });
});

function startServer() {
  var httpServer = socketServer.start(app);

  var port = 3000;
  httpServer.listen(port, function () {
    console.log('express server started at port ' + port + '...');
  });
}

module.exports = {
  start: startServer
};
