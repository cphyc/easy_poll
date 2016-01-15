'use strict';

angular.module('eduquizzApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth, $rootScope) {
    $scope.isLoggedIn = Auth.isLoggedIn();
    $scope.isAdmin = Auth.isAdmin();
    $scope.getCurrentUser = Auth.getCurrentUser;

    $rootScope.$on('user:connected', function() {
      $scope.isLoggedIn = true;
      $scope.isAdmin = Auth.isAdmin();
    });
  });
