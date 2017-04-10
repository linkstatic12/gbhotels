(function () {
  'use strict';

  describe('Cities Route Tests', function () {
    // Initialize global variables
    var $scope,
      CitiesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CitiesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CitiesService = _CitiesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('cities');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/cities');
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
          CitiesController,
          mockCity;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('cities.view');
          $templateCache.put('modules/cities/client/views/view-city.client.view.html', '');

          // create mock City
          mockCity = new CitiesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'City Name'
          });

          //Initialize Controller
          CitiesController = $controller('CitiesController as vm', {
            $scope: $scope,
            cityResolve: mockCity
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:cityId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.cityResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            cityId: 1
          })).toEqual('/cities/1');
        }));

        it('should attach an City to the controller scope', function () {
          expect($scope.vm.city._id).toBe(mockCity._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/cities/client/views/view-city.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CitiesController,
          mockCity;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('cities.create');
          $templateCache.put('modules/cities/client/views/form-city.client.view.html', '');

          // create mock City
          mockCity = new CitiesService();

          //Initialize Controller
          CitiesController = $controller('CitiesController as vm', {
            $scope: $scope,
            cityResolve: mockCity
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.cityResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/cities/create');
        }));

        it('should attach an City to the controller scope', function () {
          expect($scope.vm.city._id).toBe(mockCity._id);
          expect($scope.vm.city._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/cities/client/views/form-city.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CitiesController,
          mockCity;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('cities.edit');
          $templateCache.put('modules/cities/client/views/form-city.client.view.html', '');

          // create mock City
          mockCity = new CitiesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'City Name'
          });

          //Initialize Controller
          CitiesController = $controller('CitiesController as vm', {
            $scope: $scope,
            cityResolve: mockCity
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:cityId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.cityResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            cityId: 1
          })).toEqual('/cities/1/edit');
        }));

        it('should attach an City to the controller scope', function () {
          expect($scope.vm.city._id).toBe(mockCity._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/cities/client/views/form-city.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
