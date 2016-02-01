'use strict';

angular.module('eduquizzApp')
  .controller('PollsCtrl', function ($scope, $state, $mdDialog, Restangular, gettextCatalog) {
    Restangular.all('polls').getList()
      .then(function(polls) {
        $scope.polls = polls;
      });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('polls');
    });

    $scope.newPoll = function() {
      $state.go('new_poll', {});
    };
    $scope.editPoll = function(id) {
      $state.go('edit_poll', {id: id});
    };

    var last = {
          bottom: true,
          top: false,
          left: false,
          right: true
        };

    $scope.deletePoll = function(id, ev) {
      var cfg = {
        title: gettextCatalog.getString('Would you like to delete this poll?'),
        ariaLabel: gettextCatalog.getString('delete poll'),
        confirm: gettextCatalog.getString('Confirm'),
        cancel: gettextCatalog.getString('Cancel!'),
      };
      var confirm = $mdDialog.confirm()
          .title(cfg.title)
          .ariaLabel(cfg.ariaLabel)
          .targetEvent(ev)
          .ok(cfg.confirm)
          .cancel(cfg.cancel);

      $mdDialog.show(confirm).then(function() {
        Restangular.one('polls', id).remove().then(function() {
          Restangular.all('polls').getList()
            .then(function(polls) {
              $scope.polls = polls;
            });
        });
      });
    };

    $scope.viewAnswers = function(id) {
      $state.go('view_answers', {pollId: id});
    };
  });
