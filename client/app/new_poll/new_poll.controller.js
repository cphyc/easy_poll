'use strict';

angular.module('eduquizzApp')
  .controller('NewPollCtrl', function ($scope, pollInputService, Restangular, $location) {
    $scope.poll = {
      name : 'New poll',
      before: 'Description of the poll',
      questions: [{
        question: 'Question',
        answers: ['Some answer'],
        answer: 0
      }],
      after: 'End of the poll'
    };
    var nullValue = { question : '', answer: null, answers: []};
    $scope.new_question = {value: angular.copy(nullValue)};
    $scope.validate_new_question = pollInputService.validatorGenerator('Expecting new question!', angular.copy(nullValue));
    $scope.push_question = pollInputService.pusherGenerator($scope.new_question,
      angular.copy(nullValue));

    $scope.save = function() {
      $scope.buttontext = 'Submitting…';
      Restangular.all('polls').post($scope.poll).then(function() {
        $location.path('/polls');
      });
    };

  })
  .controller('EditPollCtrl', function ($scope, Restangular, $stateParams, $location) {
    $scope.poll = Restangular.one('polls', $stateParams.id).get().$object;

    $scope.addQuestion = function() {
      if (!$scope.poll.questions) {
        $scope.poll.questions = [];
      }
      $scope.poll.questions.push({});
    }

    $scope.deleteQuestion = function(index) {
      if ($scope.poll.questions.length > index) {
        $scope.poll.questions.splice(index, 1);
      }
    }

    $scope.moveQuestion = function(index, offset) {
      if ((index > 0 && offset === -1) || (index < $scope.poll.questions.length-1 && offset === 1)) {
        var question = $scope.poll.questions[index];
        var otherQuestion = $scope.poll.questions[index+offset];
        $scope.poll.questions[index+offset] = question;
        $scope.poll.questions[index] = otherQuestion;
      }
    }

    $scope.addAnswer = function(question) {
      if (!question.answers) {
        question.answers = [];
      }
      question.answers.push('');
    }

    $scope.moveAnswer = function(question, index, offset) {
      if ((index > 0 && offset === -1) || (index < question.answers.length-1 && offset === 1)) {
        var answer = question.answers[index];
        var otherAnswer = question.answers[index+offset];
        question.answers[index+offset] = answer;
        question.answers[index] = otherAnswer;

        if (question.answer === index+offset) {
          question.answer = index;
        } else if (question.answer === index) {
          question.answer = index+offset;
        }
      }
    }

    $scope.deleteAnswer = function(question, index) {
      question.answers.splice(index, 1);

      // We change the answer iif question.answer is out of bound
      if (question.answer > question.answers.length - 1 ) {
        question.answer = question.answers.length - 1;
      }
    }

    $scope.submitPoll = function() {
      $scope.buttonText = 'Submitting…';
      Restangular.one('polls', $scope.poll._id).patch($scope.poll).then(function() {
        $location.path('/polls');
      });
    };

  });
