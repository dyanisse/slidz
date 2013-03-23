var config = require('./config');
var crypto = require('crypto');
var https = require('https');

var mongo = require('mongodb');
var mongoUri = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/mydb';

/*
 * GET files listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

/*
 * POST new file.
 */

exports.create = function(req, res){
	console.log(req.body[0]);
	var pres = req.body[0];
	mongo.Db.connect(mongoUri, function (err, db) {
	  db.collection('presentations', function(er, collection) {
		//todo: strip extension on name
	    collection.insert({	'name': pres.filename,
													'user_id': 1,
												 	'fp_url': pres.url, 
													'filename': pres.filename,
													'mimetype': pres.mimetype,
													'size': pres.size,
													's3_key': pres.key
													}, {safe: true}, function(er,rs) {
														console.log('Success: ' + rs[0]._id);
														//res.redirect('decks/'+rs[0]._id);
														// return 200 with id.
														res.json({ id: rs[0]._id })
													});
												
	  });
	});
  //res.send("file uploaded");
	
  //redirect to /decks/_id (show)
};


exports.show = function(req, res){
	deck = null;
	mongo.Db.connect(mongoUri, function (err, db) {
	  db.collection('presentations', function(er, collection) {
		//todo: strip extension on name
		collection.findOne({'_id':new mongo.BSONPure.ObjectID(req.params.id)}, function(err, item) {
								deck = item;
								res.render('edit', {title: item.name, deck: item });
		        });
			});
	});
};

exports.update = function(req, res){
  res.send("respond with resource" + req.params.id);
};

//upload to slideshare
upload_slideshare = function(deck_url, title){
	
	var api_key = config.slideshare.api_key;
	var shared_secret = config.slideshare.shared_secret;
	var username = config.slideshare.username;
	var password = config.slideshare.password;
	var host = config.slideshare.host;
	var upload_endpoint = config.slideshare.endpoints.upload;
	
	var date = Math.round(new Date().getTime()/1000);
	var shasum = crypto.createHash('sha1');
	shasum.update(shared_secret + date);
	
	var parameters = 'api_key=' + api_key;
	parameters += '&hash=' + shasum.digest('hex');
	parameters += '&ts=' + date;	
	parameters += '&username=' + username;
	parameters += '&password=' + password;
	parameters += '&slideshow_title=' + title;
	parameters += '&upload_url=' + encodeURIComponent(deck_url);
		
	var path = upload_endpoint + parameters;
		
	var options = { host: host, path: path	};

	https.get(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.on("data", function(chunk) {
		    console.log("BODY: " + chunk);
		  });
	}).on('error', function(e) {
	  console.log('ERROR: ' + e.message);
	});
	
	// todo: parse the xml and store the slideshow_id in mongo
	
	// then do a get_slideshow requrest to get the url and s3 url and more data from slideshare
	
};


