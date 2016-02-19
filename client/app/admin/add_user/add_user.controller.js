'use strict';
angular.module('eduquizzApp')
.controller('AddUserCtrl', function($scope, $rootScope, Restangular, $window) {
  var dummyUser = function() {
    return {
      name: '',
      status: null
    };
  };
  $scope.saving = false;
  $scope.users = [dummyUser()];

  $scope.addUser = function() {
    if (_.last($scope.users).name) {
      $scope.users.push(dummyUser());
    }
  };

  $scope.saveUsers = function() {
    $scope.saving = true;
    var promises = $scope.users.filter(function(user) {
      return !user.saved;
    }).map(function(user) {
      // Password is the name, in lower case with spaces replaced by ''
      user.password = user.name.toLowerCase().replace(' ', '');
      var prom = Restangular.all('users').post(user);

      user.status = 'saving';
      return prom.then(function(ans) {
        user.status = 'saved';
        return;
      }).catch(function(err) {
        user.status = 'error';
        throw new Error(err);
      });
    });

    $window.Q.all(promises).then(function() {
      $scope.saving = false;
      $rootScope.$broadcast('update:users');
      $scope.$close();
    }).catch(function() {
      $scope.saving = false;
    });
  };
});
