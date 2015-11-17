'use strict';

angular.module('eduquizzApp')
  .controller('AnswerPollListCtrl', function ($scope, Poll, $location) {
    $scope.polls = Poll.query();
    $scope.message = 'Hello';

    $scope.answerPoll = function(id) {
      $location.path('/answer_poll/' + id)
    }
  })
  .controller('AnswerPollCtrl', function($scope, $stateParams, Poll, Answer) {
    $scope.poll = Poll.get({id: $stateParams.id}, function() {

      // Create an answer object
      $scope.answers = new Answer({
        pollId: $scope.poll._id,
        questions: new Array($scope.poll.questions.length)
      });
    });

    $scope.saveAnswers = function() {
      if ($scope.answers) {
        $scope.answers.$save();
      }
    };
  });
