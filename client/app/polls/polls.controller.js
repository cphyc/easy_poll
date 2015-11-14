'use strict';

angular.module('eduquizzApp')
  .controller('PollsCtrl', function ($scope, $http, $modal, $rootScope) {
    $http.get('/api/polls').then(function(reply) {
      $scope.polls = reply.data;
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('polls');
    });

    $scope.newPoll = function() {
      var scope = $rootScope.$new();
      scope.modal = {
        title: 'New poll'
      };
      var modal = $modal.open({
        scope: scope,
        templateUrl: 'app/polls/views/new-poll.html'
      })
    };
  });
