'use strict';

// Configuring the Articles module
angular.module('trees').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Trees', 'trees', 'dropdown', '/trees(/create)?');
		Menus.addSubMenuItem('topbar', 'trees', 'List Trees', 'trees');
		Menus.addSubMenuItem('topbar', 'trees', 'New Tree', 'trees/create');
	}
]);