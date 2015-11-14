'use strict';

angular.module('eduquizzApp')
  .controller('NewPollCtrl', function ($scope) {
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

  })
  .controller('NewQuestionCtrl', function($scope, checkPollInputService) {
    $scope.new_answer = {value: ''};
    $scope.validate_new_answer = checkPollInputService.validatorGenerator('Expecting new question!');
    $scope.push_answer = checkPollInputService.pusherGenerator($scope.new_answer);
  });
