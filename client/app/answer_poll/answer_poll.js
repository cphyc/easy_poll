'use strict';

angular.module('eduquizzApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('polls_answer', {
        url: '/polls/answer',
        templateUrl: 'app/answer_poll/answer_poll_list.html',
        controller: 'AnswerPollListCtrl'
      })
      .state('polls_answer_one', {
        url: '/polls/answer/:id',
        templateUrl: 'app/answer_poll/answer_poll.html',
        controller: 'AnswerPollCtrl'
      });
  });
