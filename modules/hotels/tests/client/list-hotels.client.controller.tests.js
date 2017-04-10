(function () {
  'use strict';

  describe('Hotels List Controller Tests', function () {
    // Initialize global variables
    var HotelsListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      HotelsService,
      mockHotel;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _HotelsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      HotelsService = _HotelsService_;

      // create mock article
      mockHotel = new HotelsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Hotel Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Hotels List controller.
      HotelsListController = $controller('HotelsListController as vm', {
        $scope: $scope
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockHotelList;

      beforeEach(function () {
        mockHotelList = [mockHotel, mockHotel];
      });

      it('should send a GET request and return all Hotels', inject(function (HotelsService) {
        // Set POST response
        $httpBackend.expectGET('api/hotels').respond(mockHotelList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.hotels.length).toEqual(2);
        expect($scope.vm.hotels[0]).toEqual(mockHotel);
        expect($scope.vm.hotels[1]).toEqual(mockHotel);

      }));
    });
  });
})();
