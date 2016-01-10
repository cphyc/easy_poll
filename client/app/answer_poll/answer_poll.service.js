'use strict';

angular.module('eduquizzApp')
  .service('Answer', function (Restangular) {
    return function(pollId) {
      // Get a fresh answer object
      return {
        get: function() {
          return Restangular.all('answers').one('poll', pollId).get();
        },
        postAnswer: function(questionNumber, answer) {
          return Restangular.all('answers')
            .one('poll', pollId)
            .one('question', questionNumber)
            .post([answer]);
        }
      };
    };
  });
