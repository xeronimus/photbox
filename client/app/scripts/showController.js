'use strict';

function ShowController(ShowService, SERVER, $interval) {

  var INTERVALL_MS = 14000;
  var interval;

  var vm = this;
  vm.hasImages = hasImages;
  vm.currentImageIndex = -1;
  vm.currentImage = undefined;
  vm.nextImage = nextImage;
  vm.SERVER_PHOTO = SERVER + 'photos';

  function hasImages() {
    return ShowService.getImageCount() > 0;
  }

  function startLooping() {
    interval = $interval(nextImage, INTERVALL_MS);
  }

  function nextImage() {
    var next = ShowService.getNextImage(vm.currentImageIndex);
    vm.currentImageIndex = next.index;
    vm.currentImage = SERVER + 'photos/' + next.image;
  }

  function onNewImage(newImage) {
    $interval.cancel(interval);
    vm.currentImage = SERVER + 'photos/' + newImage;
    startLooping();
  }

  function init() {
    ShowService.registerListener(onNewImage);
    nextImage();
    startLooping();
  }

  init();

}

angular.module('photbox').controller('ShowController', ShowController);
