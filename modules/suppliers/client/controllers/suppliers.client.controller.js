'use strict';
angular.module('suppliers').controller('SuppliersController', ['$scope', '$stateParams', '$sce', '$location', 'Authentication', 'Suppliers',
	function($scope, $stateParams, $sce, $location, Authentication, Suppliers) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var supplier = new Suppliers({
				name: this.name,
        country: this.country,
        city: this.country,
        address: this.address,
        postcode: this.postcode,
        website: this.website,
        mail: this.mail,
        description: this.description
			});
			supplier.$save(function(response) {
				$location.path('suppliers/' + response._id);

        $scope.name = '';
        $scope.country = '';
        $scope.city = '';
        $scope.address = '';
        $scope.postcode = '';
        $scope.website = '';
        $scope.mail = '';
        $scope.description = '';
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
			});
		};
	}
]);
