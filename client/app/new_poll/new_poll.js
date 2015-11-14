'use strict';

angular.module('eduquizzApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('new_poll', {
        url: '/new_poll',
        templateUrl: 'app/new_poll/new_poll.html',
        controller: 'NewPollCtrl'
      });
  });