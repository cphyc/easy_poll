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
    $scope.poll = Poll.get({id: $stateParams.id}, function() {
      // Create an answer object
      $scope.answers = new Array($scope.poll.questions.length - 1);
    });

    $scope.saveAnswers = function() {
      if ($scope.answers) {
        new Answer({
          user: Auth.getCurrentUser()._id,
          poll: $scope.poll._id,
          answers: $scope.answers
        }).$save();
      }
    };
  });
