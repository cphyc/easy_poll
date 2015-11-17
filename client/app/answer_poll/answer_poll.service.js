'use strict';

angular.module('eduquizzApp')
  .factory('Answer', function ($resource) {
    return $resource('/api/answers/:id', {id: '@_id'});
  });
