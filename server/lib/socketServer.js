'use strict';

var
  http = require('http'),
  socketIO = require('socket.io');

var io;

function onConnection(socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
}

function start(expressApp) {
  var httpServer = http.Server(expressApp);
  io = socketIO(httpServer);
  io.on('connection', onConnection);
  return httpServer;
}

function broadcastNewImage(image) {
  io.emit('newImage', image);
}

module.exports = {
  start: start,
  broadcastNewImage: broadcastNewImage
};