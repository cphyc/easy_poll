'use strict';

angular.module('eduquizzApp')
  .factory('UploadFactory', function ($modal) {
    return function() {
      var modal = $modal.open({
        templateUrl: 'app/upload/upload.html',
        controller: 'UploadModalCtrl',
        backdrop: 'static'
      });

      return modal.result;
    };
  })
.controller('UploadModalCtrl', function($scope, Restangular) {
  $scope.uploading = false;
  $scope.uploaded = false;

  $scope.nToFetch = 10;
  $scope.imageUrls = [];
  $scope.updatePictureList = function() {
    Restangular.all('upload')
      .one('last', $scope.nToFetch)
      .getList().then(function(list) {
        $scope.imageUrls = list;
      });
  };

  $scope.updatePictureList();
  });
