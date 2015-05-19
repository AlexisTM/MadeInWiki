'use strict';

//Suppliers service used for communicating with the suppliers REST endpoints
angular.module('suppliers').factory('Suppliers', ['$resource',
	function($resource) {
		return $resource('api/suppliers/:supplierId', {
			supplierId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
