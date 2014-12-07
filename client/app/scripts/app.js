angular.module('photbox', [
  'ngResource',
  'ngSanitize'
])
  .constant('SERVER_API', 'http://localhost:3000/api')
  .constant('SERVER_PHOTO', 'http://localhost:3000/photos');
