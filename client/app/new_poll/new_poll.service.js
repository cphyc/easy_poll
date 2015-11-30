'use strict';

angular.module('eduquizzApp')
  .service('pollInputService', function(Poll, $q) {
    return {
      // function generator that check that the data hasn't 0 length
      validatorGenerator: function(errorMessage, nullValue) {
        return function(data) {
          if (!data || angular.equals(data, nullValue)) {
            return errorMessage;
          }
        };
      },
      // Pushes the value of itemobj into target, replacing it by nullValue
      pusherGenerator: function(itemobj, nullValue) {
        return function(target) {
          target.push(itemobj.value);
          itemobj.value = nullValue;
        };
      },
      // check the Poll
      pollValidator: function(poll) {
        // check that the poll has a name
        if (!poll.name) {
          return false;
        }
        if (!poll.questions || poll.questions.length === 0) {
          return false;
        }
        return poll.questions.every(function(questionObj) {
          // Check that a question is asked
          if (!questionObj.question || !questionObj.question.trim() === '') {
            return false;
          }
          // Check some answers are given
          if (!questionObj.answers || questionObj.answers.length === 0) {
            return false;
          }
          // Check that the correct answer is one of the answer
          if (questionObj.answers.length <= questionObj.answer) {
            return false
          }
          // Check that each answer is asked
          return questionObj.answers.every(function(answer) {
            if (!answer || answer.trim() === '') {
              return false;
            } else {
              return true;
            }
          });
        });
      },
      // Send the Poll
      submitPoll: function(poll) {
        var deferred = $q.defer();

        var p = new Poll(poll);

        p.$save(function(data) {
          deferred.resolve(data);
        }, function(err) {
          deferred.reject(err);
        });

        return deferred.promise;
      }
    };
  });
