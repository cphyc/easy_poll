'use strict';

angular.module('eduquizzApp')
  .directive('editable', function() { return {
    restrict: 'A',
    controller: function($scope) {
      $scope.reveal = false;
    }
  };
});
