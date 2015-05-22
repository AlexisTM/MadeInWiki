'use strict';
angular.module('components').controller('ComponentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Components',
	function($scope, $stateParams, $location, Authentication, Components) {
		$scope.authentication = Authentication;

		$scope.create = function() {
      this.categories = [null];
			var component = new Components({
				name: this.name,
				reference: this.reference,
        description: this.description,
        categories: this.categories
			});
			component.$save(function(response) {
				$location.path('components/' + response._id);

				$scope.name = '';
				$scope.reference = '';
        $scope.description = '';
        $scope.categories = [null];
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(component) {
			if (component) {
				component.$remove();

				for (var i in $scope.components) {
					if ($scope.components[i] === component) {
						$scope.components.splice(i, 1);
					}
				}
			} else {
				$scope.component.$remove(function() {
					$location.path('components');
				});
			}
		};

		$scope.update = function() {
			var component = $scope.component;
      if(component.suppliers === [])
        component.suppliers = [null];
      if(component.categories === [])
        component.categories = [null];
      if(component.images === [])
        component.images = [null];

			component.$update(function() {
				$location.path('components/' + component._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.components = Components.query();

		};

		$scope.findOne = function() {
			$scope.component = Components.get({
				componentId: $stateParams.componentId
			});
		};
	}
]);
