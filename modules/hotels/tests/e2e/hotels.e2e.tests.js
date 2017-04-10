'use strict';

describe('Hotels E2E Tests:', function () {
  describe('Test Hotels page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/hotels');
      expect(element.all(by.repeater('hotel in hotels')).count()).toEqual(0);
    });
  });
});
