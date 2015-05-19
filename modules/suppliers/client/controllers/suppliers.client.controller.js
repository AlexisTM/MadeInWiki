'use strict';
angular.module('suppliers').controller('SuppliersController', ['$scope', '$stateParams', '$sce', '$location', 'Authentication', 'Suppliers',
	function($scope, $stateParams, $sce, $location, Authentication, Suppliers) {
		$scope.authentication = Authentication;

    var md = markdownit();

		$scope.create = function() {
			var supplier = new Suppliers({
				title: this.title,
				content: this.content
			});
			supplier.$save(function(response) {
				$location.path('suppliers/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(supplier) {
			if (supplier) {
				supplier.$remove();

				for (var i in $scope.suppliers) {
					if ($scope.suppliers[i] === supplier) {
						$scope.suppliers.splice(i, 1);
					}
				}
			} else {
				$scope.supplier.$remove(function() {
					$location.path('suppliers');
				});
			}
		};

		$scope.update = function() {
			var supplier = $scope.supplier;

			supplier.$update(function() {
				$location.path('suppliers/' + supplier._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.suppliers = Suppliers.query();

		};

		$scope.findOne = function() {
			$scope.supplier = Suppliers.get({
				supplierId: $stateParams.supplierId
			}, function(){
        $scope.supplier.contentRendered = $sce.trustAsHtml(md.render($scope.supplier.content));
      });
		};
	}
]);
