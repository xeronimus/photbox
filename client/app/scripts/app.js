angular.module('photbox', [
  'ngResource',
  'ngSanitize'
])
  .constant('REST_API_URL', 'http://192.168.0.9:3000/api');
