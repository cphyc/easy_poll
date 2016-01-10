'use strict';

angular.module('eduquizzApp')
  .factory('Poll', function (Restangular) {
    return {
      getList: function() {
        return Restangular.all('polls').getList();
      },
      create: function(poll) {
        return Restangular.all('polls').post(poll);
      },
      get: function(pollId) {
        return Restangular.one('polls', pollId).get();
      }
    };
  });
