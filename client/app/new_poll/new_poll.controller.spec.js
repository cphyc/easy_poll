'use strict';

describe('Controller: NewPollCtrl', function () {

  // load the controller's module
  beforeEach(module('eduquizzApp'));

  var NewPollCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewPollCtrl = $controller('NewPollCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
