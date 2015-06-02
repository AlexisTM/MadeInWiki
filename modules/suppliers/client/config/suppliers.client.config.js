'use strict';

// Configuring the Suppliers module
angular.module('suppliers').run(['Menus',
	function(Menus) {
		// Add the suppliers dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Suppliers',
			state: 'suppliers',
			type: 'dropdown',
      isPublic: false
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'suppliers', {
			title: 'List Suppliers',
			state: 'suppliers.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'suppliers', {
			title: 'Create Suppliers',
			state: 'suppliers.create'
		});
	}
]);
