'use strict';

//Trees service used to communicate Trees REST endpoints
angular.module('trees').factory('Trees', ['$resource',
	function($resource) {
		return $resource('trees/:treeId', { treeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);