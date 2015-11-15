'use strict';

angular.module('eduquizzApp')
  .controller('NewPollCtrl', function ($scope, pollInputService) {
    $scope.poll = {
      name : 'About distance',
      questions: [{
        question: 'What\'s the shortest distance?',
        answers: ['Moon-earth', 'Earth-sun', 'Sun-Moon', 'You and me'],
        answer: 3
      }, {
        question: 'Order these from the smallest to the largest. 1) Atom, 2) Human being, 3) the earth, 4) the Universe',
        answers: ['1, 2, 3, 4', '1, 2, 4, 3', '1, 3, 2, 4', '1, 3, 4, 2'],
        answer : 1
      }]
    };

    var nullValue = { question : '', answer: null, answers: []};
    $scope.new_question = {value: angular.copy(nullValue)};
    $scope.validate_new_question = pollInputService.validatorGenerator('Expecting new question!', angular.copy(nullValue));
    $scope.push_question = pollInputService.pusherGenerator($scope.new_question, angular.copy(nullValue));

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
