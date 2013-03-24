var config = require('../config');
var crypto = require('crypto');
var https = require('https');
var xml2js = require('xml2js');

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
	var file_url = "https://s3.amazonaws.com/slidz_ppt/" + pres.key;
	upload_slideshare(file_url, "test", function(xml) {
		parse_slide_id(xml, function(id) {
			get_slideshare(id, function(xml) {
				parse_slide_url(xml, function(url) {
				//put mongo insert in a function
					mongo.Db.connect(mongoUri, function (err, db) {
	  				db.collection('presentations', function(er, collection) {
							//todo: strip extension on name
	    				collection.insert(
								{	'name': pres.filename,
								'user_id': 1,
				 				'fp_url': pres.url, 
								'filename': pres.filename,
								'mimetype': pres.mimetype,
								'size': pres.size,
								's3_key': pres.key, 
								'slideshare_id': Number(id),
								'slideshare_url': url },
								{ safe: true }, 
		  					function(er,rs) {
									console.log('Successful insert in mongo obj_id: ' + rs[0]._id);
									// return 200 with id.
									res.json({ id: rs[0]._id });
								});
							});
						});
					});
				});								
	  });
	});
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
upload_slideshare = function(deck_url, title, callback){
	
	//create slideshare_request(endpoint, additionnal_params, callback)
	var api_key = config.slideshare.api_key;
	var shared_secret = config.slideshare.shared_secret;
	var username = config.slideshare.username;
	var password = config.slideshare.password;
	var host = config.slideshare.host;
	var upload_endpoint = config.slideshare.endpoints.upload;
	
	var date = Math.round(new Date().getTime()/1000);
	var shasum = crypto.createHash('sha1');
	shasum.update(shared_secret + date);
	
	var parameters = '?api_key=' + api_key;
	parameters += '&hash=' + shasum.digest('hex');
	parameters += '&ts=' + date;	
	parameters += '&username=' + username;
	parameters += '&password=' + password;
	parameters += '&slideshow_title=' + title;
	parameters += '&upload_url=' + encodeURIComponent(deck_url);
		
	var path = upload_endpoint + parameters;
	console.log("URL: " + path);
	var options = { host: host, path: path	};

	https.get(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.on("data", function(chunk) {
		    console.log("BODY: " + chunk);
				callback(chunk);
		  });
	}).on('error', function(e) {
	  console.log('ERROR: ' + e.message);
	});
	
};

get_slideshare = function(id, callback){
	
	//create slideshare_request(endpoint, additionnal_params, callback)
	var api_key = config.slideshare.api_key;
	var shared_secret = config.slideshare.shared_secret;
	var date = Math.round(new Date().getTime()/1000);
	var shasum = crypto.createHash('sha1');
	shasum.update(shared_secret + date);	
	var parameters = '?api_key=' + api_key;
	parameters += '&hash=' + shasum.digest('hex');
	parameters += '&ts=' + date;
	//end
	
	parameters += '&slideshow_id=' + id;
	
	var host = config.slideshare.host;
	var get_endpoint = config.slideshare.endpoints.get;
	var path = get_endpoint + parameters;
	console.log("URL: " + path);
	var options = { host: host, path: path	};

	https.get(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.on("data", function(chunk) {
		    console.log("BODY: " + chunk);
				callback(chunk);
		  });
	}).on('error', function(e) {
	  console.log('ERROR: ' + e.message);
	});
};

parse_slide_id = function(xml, callback){
	var parseString = require('xml2js').parseString;
	parseString(xml, function (err, result) {
			var id = result['SlideShowUploaded']['SlideShowID'][0];
	    console.log('YESSSSS ID: ' + id);
			callback(id);
	});
};

parse_slide_url = function(xml, callback){
	var parseString = require('xml2js').parseString;
	parseString(xml, function (err, result) {
			var url = result['Slideshow']['URL'][0];
	    console.log(url);
			callback(url);
	});
};


