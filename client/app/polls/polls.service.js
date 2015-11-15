'use strict';

angular.module('eduquizzApp')
  .factory('Poll', function ($resource) {
    return $resource('/api/polls/:id', {id: '@_id'}, {
      update: {
        method: 'PUT'
      }
    });
  });
