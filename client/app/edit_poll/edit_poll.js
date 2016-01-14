'use strict';

angular.module('eduquizzApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('new_poll', {
        url: '/polls/new',
        templateUrl: 'app/edit_poll/edit_poll.html',
        controller: 'EditPollCtrl'
      })
      .state('edit_poll', {
        url: '/polls/edit/:id',
        templateUrl: 'app/edit_poll/edit_poll.html',
        controller: 'EditPollCtrl'
      });
  });
