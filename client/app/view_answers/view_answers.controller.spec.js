'use strict';

describe('Controller: ViewAnswersCtrl', function () {

  // load the controller's module
  beforeEach(module('eduquizzApp'));

  var ViewAnswersCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ViewAnswersCtrl = $controller('ViewAnswersCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
