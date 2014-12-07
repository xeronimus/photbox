var express = require('express'),
  photbox = require('./photbox'),
  photoStorage = require('./photoStorage'),
  path = require('path'),
  responseHandler = require('./responseHandler'),
  settings = require('../settings');
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


app.get('/api/photo', function (req, res) {

  function sendError(err) {
    responseHandler.error(err, res);
  }

  photbox.take()
    .then(function (pictureData) {
      photoStorage.storePicture(pictureData)
        .then(function (result) {
          responseHandler.success(result, res);
        }, sendError);
    }, sendError);
});

app.get('/api/connect', function (req, res) {
  photbox.connectCam().then(function (result) {
    responseHandler.success(result, res);
  }, function (err) {
    responseHandler.error(err, res, 503);
  });
});

app.get('/api/status', function (req, res) {
  photbox.status().then(function (result) {
    responseHandler.success(result, res);
  }, function (err) {
    responseHandler.error(err, res);
  });
});

function startServer() {
  var port = 3000;
  app.listen(port, function () {
    console.log('express server started at port ' + port + '...');
  });
}

module.exports = {
  start: startServer
};
