'use strict';

angular.module('eduquizzApp')
  .controller('ViewAnswersCtrl', function ($scope, $stateParams, $http, Restangular, gettextCatalog, $mdDialog) {
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
      Restangular.one('polls', $stateParams.pollId)
      .all('results')
      .get('csv')
      .then(function(csvString) {
        var blob = new Blob([csvString], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "sondage.csv");
      });
    };

    $scope.deleteAnswer = function(ans, ev) {
      var cfg = {
        title: gettextCatalog.getString('Would you like to delete this answer?'),
        ariaLabel: gettextCatalog.getString('delete answer'),
        confirm: gettextCatalog.getString('Confirm'),
        cancel: gettextCatalog.getString('Cancel!'),
      }
      var confirm = $mdDialog.confirm()
          .title(cfg.title)
          .ariaLabel(cfg.ariaLabel)
          .targetEvent(ev)
          .ok(cfg.confirm)
          .cancel(cfg.cancel);
      $mdDialog.show(confirm).then(function() {
        var target = Restangular.all('answers').one('poll', ans.poll._id).one('answer', ans.answer);
        target.remove()
        .then(function() {
          $scope.updateAnswers();
        });
      });
    };

    $scope.updateAnswers = function() {
      Restangular.one('polls', $stateParams.pollId).getList('results').then(function(answers) {
        $scope.answers = answers;
      });
    };

  })
  .controller('ViewOneAnswerController', function($scope) {
    $scope.showDetails = false;
    $scope.toggleShow = function() {
      $scope.showDetails = !$scope.showDetails;
    }
  });
