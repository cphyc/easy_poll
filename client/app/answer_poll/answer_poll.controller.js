'use strict';

angular.module('eduquizzApp')
  .controller('AnswerPollListCtrl', function ($scope, Restangular, $state) {
    $scope.polls = Restangular.all('polls').getList().$object;
    $scope.message = 'Hello';

    $scope.answerPoll = function(id) {
      $state.go('polls_answer_one', {id: id});
    }
  })
  .controller('AnswerPollCtrl', function($scope, $stateParams, Restangular, Auth) {
    $scope.questionNumber = 0;
    $scope.poll = Restangular.one('polls', $stateParams.id).get().then(function(poll) {
      // Create an answer object
      $scope.poll = poll;
      $scope.answers         = new Array(poll.questions.length - 1);
      $scope.currentQuestion = poll.questions[$scope.questionNumber];
      $scope.lastQuestion    = poll.questions.length - 1;
    });

    $scope.nextQuestion = function() {
      $scope.questionNumber += 1;
      $scope.currentQuestion = $scope.poll.questions[$scope.questionNumber];
    }

    $scope.saveButton = 'Save answers';
    $scope.saveAnswers = function() {
      if ($scope.answers) {
        $scope.saveButton = 'Saving answers…';
        var newAnswer = {
          user: Auth.getCurrentUser()._id,
          poll: $scope.poll._id,
          answers: $scope.answers
        };
        Restangular.all('answers').post(newAnswer).then(function() {
          $scope.saveButton = 'Answers saved!';
          $scope.submitted = true;
        })
        .catch(function(a) {
          $scope.saveButton = 'Error while saving. Try again.';
        });
      }
    };
  });
