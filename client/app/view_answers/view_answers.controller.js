'use strict';

angular.module('eduquizzApp')
  .controller('ViewAnswersCtrl', function ($scope, $stateParams, Restangular) {
    Restangular.one('polls', $stateParams.pollId).getList('results').then(function(answers) {
      $scope.answers = answers;
      $scope.answers.forEach(function(answer) {
        answer.goodAnswers = answer.correction.reduce(function(agg, el) { return (el.goodAnswer) ? agg + 1: agg; }, 0);
      });
    })
    Restangular.one('polls', $stateParams.pollId).get().then(function(poll) {
      $scope.poll = poll;
    });
  })
  .controller('ViewOneAnswerController', function($scope) {
    $scope.showDetails = false;
    $scope.toggleShow = function() {
      $scope.showDetails = !$scope.showDetails;
    }
  });
