'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var trees = require('../../app/controllers/trees');

	// Trees Routes
	app.route('/trees')
		.get(trees.list)
		.post(users.requiresLogin, trees.create);

	app.route('/trees/:treeId')
		.get(trees.read)
		.put(users.requiresLogin, trees.hasAuthorization, trees.update)
		.delete(users.requiresLogin, trees.hasAuthorization, trees.delete);

    app.route('/listTreesByPrice')
        .get(trees.listByPrice);

	// Finish by binding the Tree middleware
	app.param('treeId', trees.treeByID);
};