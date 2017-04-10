'use strict';

describe('Tourists E2E Tests:', function () {
  describe('Test Tourists page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/tourists');
      expect(element.all(by.repeater('tourist in tourists')).count()).toEqual(0);
    });
  });
});
