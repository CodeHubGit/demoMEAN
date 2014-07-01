'use strict';

(function() {
	// Trees Controller Spec
	describe('Trees Controller Tests', function() {
		// Initialize global variables
		var TreesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
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
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Trees controller.
			TreesController = $controller('TreesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Tree object fetched from XHR', inject(function(Trees) {
			// Create sample Tree using the Trees service
			var sampleTree = new Trees({
				name: 'New Tree'
			});

			// Create a sample Trees array that includes the new Tree
			var sampleTrees = [sampleTree];

			// Set GET response
			$httpBackend.expectGET('trees').respond(sampleTrees);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.trees).toEqualData(sampleTrees);
		}));

		it('$scope.findOne() should create an array with one Tree object fetched from XHR using a treeId URL parameter', inject(function(Trees) {
			// Define a sample Tree object
			var sampleTree = new Trees({
				name: 'New Tree'
			});

			// Set the URL parameter
			$stateParams.treeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/trees\/([0-9a-fA-F]{24})$/).respond(sampleTree);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tree).toEqualData(sampleTree);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Trees) {
			// Create a sample Tree object
			var sampleTreePostData = new Trees({
				name: 'New Tree'
			});

			// Create a sample Tree response
			var sampleTreeResponse = new Trees({
				_id: '525cf20451979dea2c000001',
				name: 'New Tree'
			});

			// Fixture mock form input values
			scope.name = 'New Tree';

			// Set POST response
			$httpBackend.expectPOST('trees', sampleTreePostData).respond(sampleTreeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Tree was created
			expect($location.path()).toBe('/trees/' + sampleTreeResponse._id);
		}));

		it('$scope.update() should update a valid Tree', inject(function(Trees) {
			// Define a sample Tree put data
			var sampleTreePutData = new Trees({
				_id: '525cf20451979dea2c000001',
				name: 'New Tree'
			});

			// Mock Tree in scope
			scope.tree = sampleTreePutData;

			// Set PUT response
			$httpBackend.expectPUT(/trees\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/trees/' + sampleTreePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid treeId and remove the Tree from the scope', inject(function(Trees) {
			// Create new Tree object
			var sampleTree = new Trees({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Trees array and include the Tree
			scope.trees = [sampleTree];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/trees\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTree);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.trees.length).toBe(0);
		}));
	});
}());