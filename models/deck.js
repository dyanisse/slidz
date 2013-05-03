
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
	, crypto = require('crypto')
  , _ = require('underscore')

/**
* Decks Schema
*/

var DeckSchema = new Schema({
	name: String,
	fp_url: String,
	filename: String,
	mimetype: String,
	size: Number,
	s3_key: String,
	slideshare_id: Number,
	slideshare_url: String,
	keyword: String
})

mongoose.model('Deck', DeckSchema)