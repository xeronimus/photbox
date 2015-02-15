'use strict';

function ShowService(SERVER, PhotoList) {

  var socket;

  var images = [];
  var listeners = [];

  initSocketConnection();
  loadAllImagesFromServer();

  return {
    getImageCount: getImageCount,
    getNextImage: getNextImage,
    registerListener: registerListener
  };

  function loadAllImagesFromServer() {
    PhotoList.get({}, function (list) {
      images = list;
    })
  }

  function registerListener(listener) {
    listeners.push(listener);
  }

  function initSocketConnection() {
    socket = io(SERVER);
    socket.on('newImage', onNewImageFromServer);
  }

  function onNewImageFromServer(image) {
    console.log('got new image from server', image.fileName);
    images.push(image.fileName);
    notifyListeners(image.fileName);
  }

  function notifyListeners(fileName) {
    listeners.forEach(function (listener) {
      listener(fileName);
    });
  }

  function getImageCount() {
    return images.length;
  }

  function getNextImage(currentIndex) {
    var next = currentIndex + 1;

    if (next > images.length - 1) {
      next = 0;
    }
    return {
      image: images[next],
      index: next
    };
  }
}

angular.module('photbox').factory('ShowService', ShowService);
