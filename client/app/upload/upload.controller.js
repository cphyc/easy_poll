'use strict';

angular.module('eduquizzApp')
  .controller('UploadCtrl', function ($scope, $modal) {
    $scope.uploadDialog = function() {
      $modal.open({
        templateUrl: 'app/upload/upload.html',
        controller: 'UploadModalCtrl'
      });
    };
  })
.controller('UploadModalCtrl', function($scope, Upload, $timeout) {
  $scope.uploading = false;
  $scope.uploaded = false;
  $scope.uploadFile = function(file, errFiles) {
    $scope.uploading = true;
    $scope.f = file;
    if (file) {
      file.upload = Upload.upload({
        url: 'upload/',
        data: {picture: file}
      });

      file.upload.then(function (response) {
        $timeout(function () {
          file.result = response.data;
          $scope.uploading = false;
          $scope.uploaded = true;
        });
      }, function (response) {
        if (response.status > 0) {
          $scope.errorMsg = response.status + ': ' + response.data;
        }
      }, function (evt) {
        var progress = Math.min(100, parseInt(100.0 *
           evt.loaded / evt.total));
        file.progress = progress
        $scope.uploadProgress = progress;
      });
    }
  }
  });
