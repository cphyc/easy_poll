'use strict';

angular.module('eduquizzApp')
  .controller('AnswerPollListCtrl', function ($scope, Poll, $location) {
    $scope.polls = Poll.query();
    $scope.message = 'Hello';

    $scope.answerPoll = function(id) {
      $location.path('/answer_poll/' + id)
    }
  })
  .controller('AnswerPollCtrl', function($scope, $stateParams, Poll, Answer, Auth) {
    $scope.questionNumber = 0;
    $scope.poll = Poll.get({id: $stateParams.id}, function() {
      // Create an answer object
      $scope.answers         = new Array($scope.poll.questions.length - 1);
      $scope.currentQuestion = $scope.poll.questions[$scope.questionNumber];
      $scope.lastQuestion    = $scope.poll.questions.length - 1;
    });

    $scope.nextQuestion = function() {
      $scope.questionNumber += 1;
      $scope.currentQuestion = $scope.poll.questions[$scope.questionNumber];
    }

    $scope.saveButton = 'Save answers';
    $scope.saveAnswers = function() {
      if ($scope.answers) {
        $scope.saveButton = 'Saving answers…';
        var foo = new Answer({
          user: Auth.getCurrentUser()._id,
          poll: $scope.poll._id,
          answers: $scope.answers
        })
        .$save(function() {
          $scope.saveButton = 'Answers saved!';
          $scope.submitted = true;
        })
        .catch(function(a) {
          $scope.saveButton = 'Error while saving. Try again.';
        });
      }
    };
  });
