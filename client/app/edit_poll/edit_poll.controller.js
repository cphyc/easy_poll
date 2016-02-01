'use strict';

angular.module('eduquizzApp')
  .controller('EditPollCtrl', function ($scope, Restangular, $stateParams, $location, gettextCatalog) {
    var RESTPolls = Restangular.all('polls');
    if ($stateParams.id) {
      $scope.poll = Restangular.one('polls', $stateParams.id).get().$object;
    } else {
      $scope.poll = {};
    }

    $scope.addQuestion = function() {
      if (!$scope.poll.questions) {
        $scope.poll.questions = [];
      }
      $scope.poll.questions.push({
        question: '<span class="note">' + gettextCatalog.getString('Ask your question here') + '</span>'
      });
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
      $scope.buttonText = gettextCatalog.getString('Submitting…');
      RESTPolls.post($scope.poll).then(function() {
        $location.path('/polls');
      });
    };

  });
