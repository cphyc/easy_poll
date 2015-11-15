'use strict';

angular.module('eduquizzApp')
  .controller('PollsCtrl', function ($scope, $location, Poll, $mdDialog) {
    $scope.polls = Poll.query();

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('polls');
    });

    $scope.newPoll = function() {
      $location.url('/polls/new');
    };
    $scope.editPoll = function(id) {
      $location.url('/polls/edit/'+id);
    };

    var last = {
          bottom: true,
          top: false,
          left: false,
          right: true
        };

    $scope.deletePoll = function(id, ev) {
      var confirm = $mdDialog.confirm()
          .title('Would you like to delete this poll?')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Please do it!')
          .cancel('No, don\'t!');

      $mdDialog.show(confirm).then(function() {
        Poll.delete({id: id}, function() {
          // Update polls list
          $scope.polls = Poll.query();
        });
      });
    };
  });
