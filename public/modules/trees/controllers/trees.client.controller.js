'use strict';

// Trees controller
angular.module('trees').controller('TreesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Trees',
	function($scope, $stateParams, $location, Authentication, Trees ) {
		$scope.authentication = Authentication;

		// Create new Tree
		$scope.create = function() {
			// Create new Tree object
			var tree = new Trees ({
				name: this.name
			});

			// Redirect after save
			tree.$save(function(response) {
				$location.path('trees/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing Tree
		$scope.remove = function( tree ) {
			if ( tree ) { tree.$remove();

				for (var i in $scope.trees ) {
					if ($scope.trees [i] === tree ) {
						$scope.trees.splice(i, 1);
					}
				}
			} else {
				$scope.tree.$remove(function() {
					$location.path('trees');
				});
			}
		};

		// Update existing Tree
		$scope.update = function() {
			var tree = $scope.tree ;

			tree.$update(function() {
				$location.path('trees/' + tree._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Trees
		$scope.find = function() {
			$scope.trees = Trees.query();
		};

		// Find existing Tree
		$scope.findOne = function() {
			$scope.tree = Trees.get({ 
				treeId: $stateParams.treeId
			});
		};
	}
]);