'use strict';

angular.module('eduquizzApp')
  .service('checkPollInputService', function() {
    return {
      // function generator that check that the data hasn't 0 length
      validatorGenerator: function(errorMessage, nullValue) {
        return function(data) {
          if (!data || angular.equals(data, nullValue) {
            return errorMessage;
          }
        }
      },
      // function generating a function pushes a new item into an array
      // and restore it to ''
      pusherGenerator: function(itemobj, nullValue) {
        return function(target) {
          target.push(itemobj.value);
          itemobj.value = nullValue;
        }
      }
    };
  });
