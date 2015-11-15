'use strict';

describe('Controller: AnswerPollCtrl', function () {

  // load the controller's module
  beforeEach(module('eduquizzApp'));

  var AnswerPollCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AnswerPollCtrl = $controller('AnswerPollCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
