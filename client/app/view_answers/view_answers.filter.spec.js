'use strict';

describe('Filter: viewAnswers', function () {

  // load the filter's module
  beforeEach(module('eduquizzApp'));

  // initialize a new instance of the filter before each test
  var viewAnswers;
  beforeEach(inject(function ($filter) {
    viewAnswers = $filter('viewAnswers');
  }));

  it('should return the input prefixed with "viewAnswers filter:"', function () {
    var text = 'angularjs';
    expect(viewAnswers(text)).toBe('viewAnswers filter: ' + text);
  });

});
