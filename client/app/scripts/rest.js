'use strict';

angular.module('photbox')
  .factory('Photo', function (smartResource) {
    return smartResource('/photo', {}, {
      take: {
        isArray: false,
        method: 'GET'
      }

    });
  })

  .factory('PhotoList', function (smartResource) {
    return smartResource('/list', {}, {
      get: {
        isArray: true,
        method: 'GET'
      }
    });
  })

  .factory('Connect', function (smartResource) {
    return smartResource('/connect', {}, {
      take: {
        isArray: false,
        method: 'GET'
      }

    });
  })

  .factory('Status', function (smartResource) {
    return smartResource('/status', {}, {
      get: {
        isArray: false,
        method: 'GET'
      }

    });
  });
