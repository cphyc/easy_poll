'use strict';

angular.module('eduquizzApp')
  .controller('SettingsCtrl', function ($scope, User, Auth, gettextCatalog) {
    $scope.errors = {};

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = gettextCatalog.getString('Password successfully changed.');
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = gettextCatalog.getString('Incorrect password');
          $scope.message = '';
        });
      }
		};
  });
