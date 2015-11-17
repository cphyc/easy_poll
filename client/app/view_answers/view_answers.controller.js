'use strict';

angular.module('eduquizzApp')
  .controller('ViewAnswersCtrl', function ($scope, $stateParams, Poll) {
    $scope.poll = Poll.get({id: $stateParams.pollId});
  });
