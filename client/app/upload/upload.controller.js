'use strict';

angular.module('eduquizzApp')
  .factory('UploadFactory', function ($modal) {
    return function() {
      var modal = $modal.open({
        templateUrl: 'app/upload/upload.html',
        controller: 'UploadModalCtrl'
      });

      return modal.result;
    };
  })
.controller('UploadModalCtrl', function($scope, Upload, $timeout, Restangular) {
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

  $scope.uploadFile = function(file) {
    $scope.uploading = true;
    $scope.f = file;
    if (file) {
      file.upload = Upload.upload({
        url: 'api/upload/',
        data: {picture: file}
      });

      file.upload.then(function (response) {
        $timeout(function () {
          var fileUrl = response.data;

          $scope.$close(fileUrl);
        });
      }, function (response) {
        if (response.status > 0) {
          $scope.errorMsg = response.status + ': ' + response.data;
        }
      }, function (evt) {
        var progress = Math.min(100, parseInt(100.0 *
           evt.loaded / evt.total));
        file.progress = progress;
        $scope.uploadProgress = progress;
      });
    }
  };

  $scope.updatePictureList();
  });
