'use strict';

angular.module('eduquizzApp')
  .factory('Answer', function ($resource) {
    return $resource('/api/answers/:id', {id: '@_id'});
  })
  .factory('UpdateAnswers', function(Restangular, $q) {
    var answerPosted = false;
    return function(user, poll, answers) {
      var deferred = $q.defer();

      var answerObj = {
        user: user._id,
        poll: poll._id,
        answers: answers
      };
      if (!answerPosted) {
        Restangular.all('answers').post(answerObj).then(function(ret) {
          answerPosted = true;
          answers._id = ret._id;
          deferred.resolve(ret);
        }, function(err) {
          deferred.reject(err);
        });
      } else {
        Restangular.one('answers', answers._id).put(answerObj).then(function(ret) {
          deferred.resolve(ret);
        }, function(err) {
          deferred.reject(err);
        });
      }

      return deferred.promise;
    }
  })
