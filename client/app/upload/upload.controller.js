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
.controller('UploadModalCtrl', function($scope, Restangular, $timeout) {
  $scope.uploading = false;
  $scope.uploaded = false;

  $scope.nToFetch = 12;
  $scope.imageUrls = [];
  function updatePictureList(n) {
    Restangular.all('upload')
      .one('last', n)
      .getList().then(function(list) {
        $scope.imageUrls = list;
      });
  };

  $scope.showMore = function() {
    $scope.nToFetch += 4;
    updatePictureList($scope.nToFetch);
  };

  $scope.activateCropper = function() {
    $timeout(() => $timeout(() => $scope.$broadcast('show')));
  }

  updatePictureList($scope.nToFetch);
});
