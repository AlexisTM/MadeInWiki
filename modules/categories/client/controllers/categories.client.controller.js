'use strict';
angular.module('categories').controller('CategoriesController', ['$scope', '$stateParams', '$sce', '$location', 'Authentication', 'Categories',
	function($scope, $stateParams, $sce, $location, Authentication, Categories) {
		$scope.authentication = Authentication;

    var md = markdownit();

		$scope.create = function() {
			var category = new Categories({
				title: this.title,
				content: this.content
			});
			category.$save(function(response) {
				$location.path('categories/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(category) {
			if (category) {
				category.$remove();

				for (var i in $scope.categories) {
					if ($scope.categories[i] === category) {
						$scope.categories.splice(i, 1);
					}
				}
			} else {
				$scope.category.$remove(function() {
					$location.path('categories');
				});
			}
		};

		$scope.update = function() {
			var category = $scope.category;

			category.$update(function() {
				$location.path('categories/' + category._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.categories = Categories.query();

		};

		$scope.findOne = function() {
			$scope.category = Categories.get({
				categoryId: $stateParams.categoryId
			}, function(){
        $scope.category.contentRendered = $sce.trustAsHtml(md.render($scope.category.content));
      });
		};
	}
]);
