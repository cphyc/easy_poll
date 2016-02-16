'use strict';

describe('Directive: upload', function () {

  // load the directive's module and view
  beforeEach(module('eduquizzApp'));
  beforeEach(module('app/upload/upload.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<upload></upload>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the upload directive');
  }));
});