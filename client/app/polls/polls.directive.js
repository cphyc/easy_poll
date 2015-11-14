'use strict';

angular.module('eduquizzApp')
  .directive('poll', function() { return {
    restrict: 'E',
    controller: function($scope) {
      $scope.reveal = false;
    }
  }});
