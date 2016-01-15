'use strict';

angular.module('eduquizzApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, $mdDialog, gettextCatalog) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.delete = function(user, ev) {
      var cfg = {
        title: gettextCatalog.getString('Would you like to delete this user?'),
        ariaLabel: gettextCatalog.getString('delete user'),
        confirm: gettextCatalog.getString('Confirm'),
        cancel: gettextCatalog.getString('Cancel!'),
      }
      var confirm = $mdDialog.confirm()
          .title(cfg.title)
          .ariaLabel(cfg.ariaLabel)
          .targetEvent(ev)
          .ok(cfg.confirm)
          .cancel(cfg.cancel);
      $mdDialog.show(confirm).then(function() {
        User.remove({ id: user._id });
        angular.forEach($scope.users, function(u, i) {
          if (u === user) {
            $scope.users.splice(i, 1);
          }
        });
      });
    };
  });
