'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Tree = mongoose.model('Tree'),
	_ = require('lodash');


/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Tree already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Generate demo data (careful with this)
 */
//include sample json data file
var sampleData = require('./sampleData.json');

//remove existing db entries
Tree.remove(function(err, prescription){
    if(err){
        console.log(getErrorMessage(err));
    }
});

//read in sample data
for(var i = 0; i < sampleData.length; i++){
    var tree = new Tree(sampleData[i]);
    tree.save(function(err){
        if(err){
            console.log(getErrorMessage(err));
        }
    });
}


/**
 * Create a Tree
 */
exports.create = function(req, res) {
	var tree = new Tree(req.body);
	tree.user = req.user;

	tree.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(tree);
		}
	});
};

/**
 * Show the current Tree
 */
exports.read = function(req, res) {
	res.jsonp(req.tree);
};

/**
 * Update a Tree
 */
exports.update = function(req, res) {
	var tree = req.tree ;

	tree = _.extend(tree , req.body);

	tree.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(tree);
		}
	});
};

/**
 * Delete an Tree
 */
exports.delete = function(req, res) {
	var tree = req.tree ;

	tree.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(tree);
		}
	});
};

/**
 * List of Trees
 */
exports.list = function(req, res) { Tree.find().sort('-created').populate('user', 'displayName').exec(function(err, trees) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(trees);
		}
	});
};

/**
 * List of Trees sorted by price
 */
exports.listByPrice = function(req, res) { Tree.find().sort('-price').populate('user', 'displayName').exec(function(err, trees) {
    if (err) {
        return res.send(400, {
            message: getErrorMessage(err)
        });
    } else {
        res.jsonp(trees);
    }
});
};

/**
 * Tree middleware
 */
exports.treeByID = function(req, res, next, id) { Tree.findById(id).populate('user', 'displayName').exec(function(err, tree) {
		if (err) return next(err);
		if (! tree) return next(new Error('Failed to load Tree ' + id));
		req.tree = tree ;
		next();
	});
};

/**
 * Tree authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.tree.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};