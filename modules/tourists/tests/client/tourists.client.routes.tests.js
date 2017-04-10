(function () {
  'use strict';

  describe('Tourists Route Tests', function () {
    // Initialize global variables
    var $scope,
      TouristsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TouristsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TouristsService = _TouristsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('tourists');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/tourists');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          TouristsController,
          mockTourist;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('tourists.view');
          $templateCache.put('modules/tourists/client/views/view-tourist.client.view.html', '');

          // create mock Tourist
          mockTourist = new TouristsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Tourist Name'
          });

          //Initialize Controller
          TouristsController = $controller('TouristsController as vm', {
            $scope: $scope,
            touristResolve: mockTourist
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:touristId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.touristResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            touristId: 1
          })).toEqual('/tourists/1');
        }));

        it('should attach an Tourist to the controller scope', function () {
          expect($scope.vm.tourist._id).toBe(mockTourist._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/tourists/client/views/view-tourist.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TouristsController,
          mockTourist;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('tourists.create');
          $templateCache.put('modules/tourists/client/views/form-tourist.client.view.html', '');

          // create mock Tourist
          mockTourist = new TouristsService();

          //Initialize Controller
          TouristsController = $controller('TouristsController as vm', {
            $scope: $scope,
            touristResolve: mockTourist
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.touristResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/tourists/create');
        }));

        it('should attach an Tourist to the controller scope', function () {
          expect($scope.vm.tourist._id).toBe(mockTourist._id);
          expect($scope.vm.tourist._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/tourists/client/views/form-tourist.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TouristsController,
          mockTourist;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('tourists.edit');
          $templateCache.put('modules/tourists/client/views/form-tourist.client.view.html', '');

          // create mock Tourist
          mockTourist = new TouristsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Tourist Name'
          });

          //Initialize Controller
          TouristsController = $controller('TouristsController as vm', {
            $scope: $scope,
            touristResolve: mockTourist
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:touristId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.touristResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            touristId: 1
          })).toEqual('/tourists/1/edit');
        }));

        it('should attach an Tourist to the controller scope', function () {
          expect($scope.vm.tourist._id).toBe(mockTourist._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/tourists/client/views/form-tourist.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
