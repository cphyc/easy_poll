'use strict';

describe('Directive: editPoll', function () {

  // load the directive's module and view
  beforeEach(module('eduquizzApp'));
  beforeEach(module('app/edit_poll/edit_poll.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<edit-poll></edit-poll>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the editPoll directive');
  }));
});