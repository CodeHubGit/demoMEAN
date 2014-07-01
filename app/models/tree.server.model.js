'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Tree Schema
 */
var TreeSchema = new Schema({
    maxHeight: {
        type: Number,
        required: true
    },
    currentHeight: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    species: {
        type: String,
        required: true,
        trim: true
    },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Tree', TreeSchema);