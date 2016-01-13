'use strict';

angular.module('eduquizzApp')
  .directive('uploadButton', function () {
    return {
      template: '<div>Foo</div>',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
