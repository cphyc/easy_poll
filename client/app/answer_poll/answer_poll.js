'use strict';

angular.module('eduquizzApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('answer_poll', {
        url: '/answer_poll',
        templateUrl: 'app/answer_poll/answer_poll.html',
        controller: 'AnswerPollCtrl'
      });
  });