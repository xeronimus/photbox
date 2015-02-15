'use strict';

angular.module('photbox', [
  'ngResource',
  'ngSanitize',
  'ui.router'
])
  .constant('SERVER', 'http://localhost:3000/')
  //.constant('SERVER', 'http://192.168.0.9:3000/')

  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/box');

    $stateProvider
      .state('show', {
        url: '/show',
        templateUrl: 'partials/show.html',
        controller: 'ShowController',
        controllerAs: 'show'
      })
      .state('box', {
        url: '/box',
        templateUrl: 'partials/box.html',
        controller: 'MainController',
        controllerAs: 'main'
      });

  });
