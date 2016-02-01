'use strict';

angular.module('eduquizzApp')
  .controller('AnswerPollListCtrl', function ($scope, Restangular, $state) {
    $scope.polls = Restangular.all('polls').getList().$object;
    $scope.message = 'Hello';

    $scope.answerPoll = function(id) {
      $state.go('polls_answer_one', {id: id});
    };
  })
  .controller('AnswerPollCtrl', function($scope, $stateParams, Answer, Poll, Auth) {
    $scope.isAdmin = Auth.isAdmin;

    Poll.get($stateParams.id).then(function(poll) {
      // Create an answer object
      $scope.poll = poll;

      if (Auth.isAdmin()) {
        $scope.questionNumber = 0;
        $scope.answers        = [];
        $scope.lastQuestion   = poll.questions.length - 1;
      } else {
        // Get the already given answers from server
        Answer($stateParams.id).get().then(function(answer) {
          $scope.questionNumber  = answer.lastAnswered + 1;
          $scope.answers         = answer.answers;
          $scope.lastQuestion    = poll.questions.length - 1;

          $scope.$broadcast('answer:update');
        }).catch(function(err) {
          // FIXME: tell an error occured
        });
      }
    }).catch(function(err) {
      // FIXME: tell an error occured
    });

    $scope.nextQuestion = function() {
      if (Auth.isAdmin()) {
        $scope.questionNumber += 1;
        $scope.$broadcast('answer:update');
      } else {
        Answer($stateParams.id)
        .postAnswer($scope.questionNumber, $scope.answers[$scope.questionNumber])
        .then(function() {
          $scope.questionNumber += 1;

          $scope.$broadcast('answer:update');
        })
        .catch(function(err) {
          // FIXME: notice error
          console.log(err);
        });
      }
    };

    $scope.saveButton = 'Save answers';
    $scope.saveAnswers = function() {
      if (Auth.isAdmin()) {
        $scope.questionNumber += 1;
        $scope.submitted = true;
        $scope.$broadcast('answer:update');
      } else {
        if ($scope.answers) {
          $scope.saveButton = 'Saving answers…';
          Answer($stateParams.id)
          .postAnswer($scope.questionNumber, $scope.answers[$scope.questionNumber])
          .then(function() {
            $scope.questionNumber += 1;
            $scope.saveButton = 'Answers saved!';
            $scope.submitted = true;
            $scope.$broadcast('answer:update');
          }).catch(function(a) {
            $scope.saveButton = 'Error while saving. Try again.';
          });
        }
      }
    };

    $scope.$on('answer:update', function() {
      if ($scope.questionNumber > $scope.poll.questions.length - 1) {
        $scope.submitted = true;
      } else {
        $scope.currentQuestion = $scope.poll.questions[$scope.questionNumber];
      }
    })
  });
