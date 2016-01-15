'use strict';

angular.module('eduquizzApp')
  .filter('removeHtml', function () {
    return function (input) {
      var span = document.createElement('span');
      span.innerHTML = input;
      return span.textContent || span.innerText;
    };
  });
