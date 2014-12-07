angular.module('photbox')

/**
 * This service wraps the angular $resource service.
 * it appends a base url to each request.
 */
  .factory('smartResource', function (SERVER_API, $resource) {

    return function (url, params, actions) {
      return $resource(SERVER_API + url, params, actions);
    };

  });
