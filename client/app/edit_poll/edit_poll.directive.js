'use strict';

angular.module('eduquizzApp')
  .directive('quillEditor', function () {
    return {
      templateUrl: 'app/edit_poll/inline_edit.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
        new Quill()
      }
    };
  });
