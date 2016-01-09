'use strict';

angular.module('eduquizzApp')
  .controller('AnswerPollListCtrl', function ($scope, Restangular, $state) {
    $scope.polls = Restangular.all('polls').getList().$object;
    $scope.message = 'Hello';

    $scope.answerPoll = function(id) {
      $state.go('polls_answer_one', {id: id});
    }
  })
  .controller('AnswerPollCtrl', function($scope, $stateParams, UpdateAnswers, Restangular, Auth) {
    Restangular.one('polls', $stateParams.id).get().then(function(poll) {
      // Create an answer object
      $scope.poll = poll;

      // Get the already given answers from server
      Restangular.all('answers').one('user', Auth.getCurrentUser()._id).get().then(function(ret) {
        if (ret.answer) {
          $scope.questionNumber  = ret.answer.answers.length;
          $scope.answers         = ret.answer.answers;
          $scope.currentQuestion = poll.questions[$scope.questionNumber];
          $scope.lastQuestion    = poll.questions.length - 1;
        } else {
          $scope.questionNumber  = 0
          $scope.answers         = new Array(poll.questions.length - 1);
          $scope.currentQuestion = poll.questions[$scope.questionNumber];
          $scope.lastQuestion    = poll.questions.length - 1;
        }
      }).catch(function(err) {
        // FIXME: tell an error occured
      });
    }).catch(function(err) {
      // FIXME: tell an error occured
    });;

    $scope.nextQuestion = function() {
      UpdateAnswers(Auth.getCurrentUser(), $scope.poll, $scope.answers).then(function() {
        $scope.questionNumber += 1;
        $scope.currentQuestion = $scope.poll.questions[$scope.questionNumber];
      }, function() {
        // FIXME: notice the user something bad happened, do not go to next question
      });
    }

    $scope.saveButton = 'Save answers';
    $scope.saveAnswers = function() {
      if ($scope.answers) {
        $scope.saveButton = 'Saving answers…';
        UpdateAnswers(Auth.getCurrentUser(), $scope.poll, $scope.answers).then(function() {
          $scope.saveButton = 'Answers saved!';
          $scope.submitted = true;
        }).catch(function(a) {
          $scope.saveButton = 'Error while saving. Try again.';
        });
      }
    };
  });
