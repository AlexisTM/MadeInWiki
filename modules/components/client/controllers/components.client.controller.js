'use strict';
angular.module('components').controller('ComponentsController', ['$scope', '$stateParams', '$sce', '$location', 'Authentication', 'Components',
	function($scope, $stateParams, $sce, $location, Authentication, Components) {
		$scope.authentication = Authentication;

    var md = markdownit();

		$scope.create = function() {
			var component = new Components({
				title: this.title,
				content: this.content
			});
			component.$save(function(response) {
				$location.path('components/' + response._id);

				$scope.title = '';
				$scope.content = '';
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
			}, function(){
        $scope.component.contentRendered = $sce.trustAsHtml(md.render($scope.component.content));
      });
		};
	}
]);
