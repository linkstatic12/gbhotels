(function () {
  'use strict';

  describe('Hotels Controller Tests', function () {
    // Initialize global variables
    var HotelsController,
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

      // create mock Hotel
      mockHotel = new HotelsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Hotel Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Hotels controller.
      HotelsController = $controller('HotelsController as vm', {
        $scope: $scope,
        hotelResolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleHotelPostData;

      beforeEach(function () {
        // Create a sample Hotel object
        sampleHotelPostData = new HotelsService({
          name: 'Hotel Name'
        });

        $scope.vm.hotel = sampleHotelPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (HotelsService) {
        // Set POST response
        $httpBackend.expectPOST('api/hotels', sampleHotelPostData).respond(mockHotel);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Hotel was created
        expect($state.go).toHaveBeenCalledWith('hotels.view', {
          hotelId: mockHotel._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/hotels', sampleHotelPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Hotel in $scope
        $scope.vm.hotel = mockHotel;
      });

      it('should update a valid Hotel', inject(function (HotelsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/hotels\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('hotels.view', {
          hotelId: mockHotel._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (HotelsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/hotels\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup Hotels
        $scope.vm.hotel = mockHotel;
      });

      it('should delete the Hotel and redirect to Hotels', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/hotels\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('hotels.list');
      });

      it('should should not delete the Hotel and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();
