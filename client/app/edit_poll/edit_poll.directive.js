'use strict';

angular.module('eduquizzApp')
  .config(function (ngQuillConfigProvider) {
      ngQuillConfigProvider.set([{
          alias: 'small',
          size: '12px'
      }, {
          default: true,
          alias: 'normal',
          size: '14px'
      }, {
          alias: 'large',
          size: '20px'
      }, {
          alias: 'huge',
          size: '24px'
      }], [{
          label: 'Arial',
          alias: 'Arial'
      }, {
          label: 'Sans Serif',
          alias: 'sans-serif'
      }, {
          label: 'Serif',
          alias: 'serif'
      }, {
          label: 'Monospace',
          alias: 'monospace'
      }, {
          label: 'Trebuchet MS',
          alias: '"Trebuchet MS"'
      }, {
          label: 'Verdana',
          alias: 'Verdana'
      }])
  })
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
        var attach = function() {
          var quillId = element[0].getElementsByClassName("ql-editor")[0].id;
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

          var elementToReplace = $(element[0].getElementsByClassName("ql-image"));

          if (elementToReplace.length === 0) {
            setTimeout(attach, 200);
            return;
          }

          elementToReplace.on("click", function() {
            $scope.uploadDialog().then(function(imageUrl) {
              if (imageUrl) {
                addImageInEditor(quillInstance, imageUrl);
              }
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
