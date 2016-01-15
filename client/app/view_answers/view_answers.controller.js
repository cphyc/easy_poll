'use strict';

angular.module('eduquizzApp')
  .controller('ViewAnswersCtrl', function ($scope, $stateParams, $http, Restangular) {
    $scope.poll = Restangular.one('polls', $stateParams.pollId).get().$object;

    Restangular.one('polls', $stateParams.pollId).getList('results').then(function(answers) {
      $scope.answers = answers;

      answers.forEach(function(answer) {

        answer.goodAnswers = answer.correction.reduce(function(agg, el) {
          return (el.goodAnswer) ? agg + 1: agg;
        }, 0);
      });
    });

    $scope.getResultsAsCsv = function() {
      var blob = Restangular.one('polls', $stateParams.pollId).all('results').get('csv').$object();
    };

  })
  .controller('ViewOneAnswerController', function($scope) {
    $scope.showDetails = false;
    $scope.toggleShow = function() {
      $scope.showDetails = !$scope.showDetails;
    }
  });
