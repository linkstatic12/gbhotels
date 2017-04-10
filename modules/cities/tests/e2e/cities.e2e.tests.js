'use strict';

describe('Cities E2E Tests:', function () {
  describe('Test Cities page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/cities');
      expect(element.all(by.repeater('city in cities')).count()).toEqual(0);
    });
  });
});
