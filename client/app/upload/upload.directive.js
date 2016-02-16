'use strict';

angular.module('eduquizzApp')
  .directive('inputFile', function () {
    return {
      templateUrl: 'app/upload/input-file.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      },
      controller: function($scope, Upload, Cropper, $timeout, gettextCatalog) {
        $scope.uploadButtonMessage = gettextCatalog.getString('Upload new file');
        $scope.showEvent = 'show';
        $scope.hideEvent = 'hide';

        $scope.options = {
          crop: dataNew => { $scope.data = dataNew; },
          build: () => { },
          built: () => { }
        };

        $scope.cropperProxy = 'cropper.first';

        $scope.uploadFile = function() {
          if (!$scope.picFile)
            return;

          var blob = $scope.picFile;
          Cropper.crop(blob, $scope.data)
          .then(Cropper.encode).then(function(dataUrl) {
            if (!dataUrl) return;

            var file = Upload.dataUrltoBlob(dataUrl, $scope.picFile.name);
            $scope.uploading = true;

            file.upload = Upload.upload({
              url: 'api/upload/',
              data: {picture: file}
            });

            file.upload.then(function (response) {
              $timeout(function () {
                $scope.uploadButtonMessage = gettextCatalog.getString('File uploaded!');
                var fileUrl = response.data;

                $scope.$close(fileUrl);
              });
            }, function (response) {
              if (response.status > 0) {
                $scope.errorMsg = response.status + ': ' + response.data;
                $scope.uploadButtonMessage = gettextCatalog.getString('An error occured');
                $timeout($scope.$close(), 1000);
              }
            }, function (evt) {
              var progress = Math.min(100, parseInt(100.0 *
                evt.loaded / evt.total));
                file.progress = progress;
                $scope.uploadProgress = progress;
                $scope.uploadButtonMessage = progress + gettextCatalog.getString('% remaining.')
            });
          });
        };
      }
    };
  });
