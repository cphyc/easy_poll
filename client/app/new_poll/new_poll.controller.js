'use strict';

angular.module('eduquizzApp')
  .controller('NewPollCtrl', function ($scope, pollInputService, Poll, $location) {
    $scope.poll = new Poll({
      name : '',
      questions: [{
        question: '',
        answers: [],
        answer: 0
      }]
    });

    var nullValue = { question : '', answer: null, answers: []};
    $scope.new_question = {value: angular.copy(nullValue)};
    $scope.validate_new_question = pollInputService.validatorGenerator('Expecting new question!', angular.copy(nullValue));
    $scope.push_question = pollInputService.pusherGenerator($scope.new_question, angular.copy(nullValue));

    $scope.save = function() {
      $scope.buttontext = 'Submitting…';
      $scope.poll.$save(function() {
        $location.path('/polls');
      })
    }

  })
  .controller('EditPollCtrl', function ($scope, pollInputService, Poll, $stateParams, $location) {
    $scope.poll = Poll.get({id: $stateParams.id});

    var nullValue = { question : '', answer: null, answers: []};
    $scope.new_question = {value: angular.copy(nullValue)};
    $scope.validate_new_question = pollInputService.validatorGenerator('Expecting new question!', angular.copy(nullValue));
    $scope.push_question = $scope.poll.$update;

    $scope.save = function() {
      $scope.buttonText = 'Submitting…';
      $scope.poll.$update(function() {
        $location.path('/polls');
      });
    }

  })
  .controller('NewQuestionCtrl', function($scope, pollInputService) {
    $scope.new_answer = {value: ''};
    $scope.validate_new_answer = pollInputService.validatorGenerator('Expecting new answer!', '');
    $scope.push_answer = pollInputService.pusherGenerator($scope.new_answer, '');
  })
  .controller('SubmitPollCtrl', function($scope, $location, pollInputService) {
    var defaultText = 'Submit poll';
    var submitting = 'Submitting poll…';
    var submitted = 'Poll submitted !';
    var error = 'Error. Click to try again submitting poll.';

    var lock = false;

    $scope.buttonText = defaultText;

    $scope.submitPoll = function(poll) {
      if (lock) {
        return;
      } else {
        lock = true;
      }
      $scope.buttonText = submitting;
      pollInputService.submitPoll(poll).then(function(answer) {
        console.log(answer);
        $scope.buttonText = submitted;
        lock = false;
        $location.path('/polls');
      }, function(err) {
        console.log(err);
        $scope.buttonText = error;
        lock = false;
      });
    }
  });
