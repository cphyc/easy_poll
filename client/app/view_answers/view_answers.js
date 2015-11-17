'use strict';

angular.module('eduquizzApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('view_answers', {
        url: '/view_answers',
        templateUrl: 'app/view_answers/view_answers.html',
        controller: 'ViewAnswersCtrl'
      });
  });