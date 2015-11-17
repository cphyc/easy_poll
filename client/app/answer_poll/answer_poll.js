'use strict';

angular.module('eduquizzApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('answer_poll_list', {
        url: '/answer_poll',
        templateUrl: 'app/answer_poll/answer_poll_list.html',
        controller: 'AnswerPollListCtrl'
      })
      .state('answer_poll', {
        url: '/answer_poll/:id',
        templateUrl: 'app/answer_poll/answer_poll.html',
        controller: 'AnswerPollCtrl'
      });
  });
