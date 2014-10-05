
angular.module('photbox')

/**
 * This service wraps the angular $resource service.
 * it appends a base url to each request.
 */
    .factory('smartResource', function (REST_API_URL, $resource) {
        return function (url, params, actions) {
            return $resource(REST_API_URL + url, params, actions);
        };

    });
