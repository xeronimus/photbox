'use strict';

// I provide a 'Fade' overlay for the primary image whenever
// the primary image source changes. This allows for a 'softer'
// transition from image to image.

// http://www.bennadel.com/blog/2497-cross-fading-images-with-angularjs.htm
function PbFaderDirective() {

  var FADE_DURATION_MS = 2000;

  return ({
    compile: compile,
    restrict: 'A',
    scope: {
      pbFader: '='
    }
  });

  function compile(element) {
    element.prepend('<img class="fader" />');
    return (link);
  }

  function link($scope, element) {

    var fader = angular.element(element[0].querySelector('.fader'));
    var primary = angular.element(element[0].querySelector('.image'));

    $scope.$watch('pbFader',
      function (newValue, oldValue) {

        if (newValue === oldValue) {
          return;
        }

        if (isFading()) {
          return;
        }

        initFade(oldValue);
      }
    );

    // I prepare the fader to show the previous image
    // while fading out of view.
    function initFade(fadeSource) {
      fader.attr('src', fadeSource);
      fader.addClass('show');

      // Don't actually start the fade until the
      // primary image has loaded the new source.
      primary.one('load', startFade);
    }

    // I determine if the fader is currently fading
    // out of view (that is currently animated).
    function isFading() {
      return ( fader.hasClass('show') || fader.hasClass('fadeOut') );
    }

    // I start the fade-out process.
    function startFade() {
      fader.addClass('fadeOut');
      setTimeout(teardownFade, FADE_DURATION_MS);
    }

    // I clean up the fader after the fade-out has
    // completed its animation.
    function teardownFade() {
      fader.removeClass('show fadeOut');
    }

  }

}


angular.module('photbox').directive('pbFader', PbFaderDirective);
