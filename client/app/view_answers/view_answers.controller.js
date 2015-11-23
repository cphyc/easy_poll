'use strict';

angular.module('eduquizzApp')
  .controller('ViewAnswersCtrl', function ($scope, $stateParams, Poll, Answer) {
    $scope.poll = Poll.get({id: $stateParams.pollId});
    $scope.answers = Answer.get({id: $stateParams.pollId});
  });
