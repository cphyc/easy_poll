'use strict';

angular.module('eduquizzApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('new_poll', {
        url: '/polls/new',
        templateUrl: 'app/new_poll/new_poll.html',
        controller: 'NewPollCtrl'
      })
      .state('edit_poll', {
        url: '/polls/edit/:id',
        templateUrl: 'app/new_poll/new_poll.html',
        controller: 'EditPollCtrl'
      });
  });
