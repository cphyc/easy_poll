'use strict';

angular.module('eduquizzApp')
  .directive('quillEditor', function () {
    function addImageInEditor(editor, imageUrl) {
      var selection = editor.getSelection();
      var retain = selection? selection.start : editor.getLength();
      var operations = [
        {
           retain: retain
        }, {
          insert: 1,
          attributes: {
            image: imageUrl
          }
        }
      ];

      editor.updateContents(operations);
    }

    return {
      templateUrl: 'app/edit_poll/edit/inline.html',
      restrict: 'EA',
      link: function ($scope, element, attrs) {
        var quillId;
        var quillInstance;
        var attach = function() {
          var quillId = element.find('.ql-editor')[0].id;
          if (!quillId) {
            setTimeout(attach, 200);
            return;
          }
          var quillInstance = Quill.editors.filter(function(e) {
            return e.id === quillId;
          })[0];
          if (!quillInstance) {
            setTimeout(attach, 200);
            return;
          }

          var elementToReplace = element.find('.ql-image');

          if (elementToReplace.length === 0) {
            setTimeout(attach, 200);
            return;
          }

          elementToReplace.click(function() {
            $scope.uploadDialog().then(function(imageUrl) {
              addImageInEditor(quillInstance, imageUrl);
            });
          });
        };
        setTimeout(attach, 200);
      },
      controller: function($scope, UploadFactory) {
        $scope.uploadDialog = UploadFactory
      }
    };
  });
