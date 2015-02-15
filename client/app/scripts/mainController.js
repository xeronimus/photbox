'use strict';

function MainController(Photo, Status, Connect, SERVER, $log) {

  var vm = this;

  vm.takePicture = takePicture;
  vm.canTakePicture = canTakePicture;
  vm.connectCam = connectCam;
  vm.lastPhoto = undefined;
  vm.camStatus = undefined;
  vm.status = 'READY';
  vm.SERVER_PHOTO = SERVER + 'photos';
  vm.SERVER_API = SERVER + 'api';

  function init() {
    Status.get({}, function (data) {
      vm.camStatus = data;
    }, handleTakePictureError);
  }

  function connectCam() {
    Connect.get({}, function (data) {
      vm.camStatus = data;
    }, function (err) {
      $log.error('could not connect camera', err);
    });
  }

  function canTakePicture() {
    return !!(vm.status === 'READY' && vm.camStatus && vm.camStatus.status === 'OK');
  }

  function handleTakePictureError(err) {
    if (err.status === 0) {
      vm.status = 'SERVER_OFFLINE';
    }
  }

  function takePicture() {
    vm.status = 'WAIT';
    Photo.take({}, function (data) {
      vm.lastPhoto = data;
      vm.status = 'READY';
    }, handleTakePictureError);
  }

  init();
}

angular.module('photbox').controller('MainController', MainController);
