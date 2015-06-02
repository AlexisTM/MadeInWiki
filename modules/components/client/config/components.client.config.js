'use strict';

// Configuring the Components module
angular.module('components').run(['Menus',
	function(Menus) {
		// Add the components dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Components',
			state: 'components',
			type: 'dropdown',
      isPublic: false
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'components', {
			title: 'List Components',
			state: 'components.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'components', {
			title: 'Create Components',
			state: 'components.create'
		});
	}
]);
