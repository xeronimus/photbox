
angular.module('photbox').controller('MainController', function (Photo, Status, Connect, REST_API_URL,$log) {

  var vm = this;

  vm.takePicture = takePicture;
  vm.canTakePicture = canTakePicture;
  vm.connectCam = connectCam;
  vm.lastPhoto = undefined;
  vm.camStatus = undefined;
  vm.status = 'READY';
  vm.REST_API_URL = REST_API_URL;

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
      return;
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
});
