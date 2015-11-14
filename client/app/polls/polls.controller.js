'use strict';

angular.module('eduquizzApp')
  .controller('PollsCtrl', function ($scope, $http, $modal, $rootScope, $location) {
    $http.get('/api/polls').then(function(reply) {
      $scope.polls = reply.data;
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('polls');
    });

    $scope.newPoll = function() {
      $location.url('/new_poll');
    };
  });
