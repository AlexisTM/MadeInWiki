'use strict';

// Setting up route
angular.module('components').config(['$stateProvider',
	function($stateProvider) {
		// Components state routing
		$stateProvider.
		state('components', {
			abstract: true,
			url: '/components',
			template: '<ui-view/>'
		}).
		state('components.list', {
			url: '',
			templateUrl: 'modules/components/views/list-components.client.view.html'
		}).
		state('components.create', {
			url: '/create',
			templateUrl: 'modules/components/views/create-component.client.view.html'
		}).
		state('components.view', {
			url: '/:componentId',
			templateUrl: 'modules/components/views/view-component.client.view.html'
		}).
		state('components.edit', {
			url: '/:componentId/edit',
			templateUrl: 'modules/components/views/edit-component.client.view.html'
		});
	}
]);
