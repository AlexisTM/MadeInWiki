'use strict';

//Components service used for communicating with the components REST endpoints
angular.module('components').factory('Components', ['$resource',
	function($resource) {
		return $resource('api/components/:componentId', {
			componentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
