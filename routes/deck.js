
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
	, Deck = mongoose.model('Deck')
	//move to model
	, env = process.env.NODE_ENV || 'development'
	, config = require('../config')[env]
	, crypto = require('crypto')
	, https = require('https')
	, xml2js = require('xml2js')

/**
 * Create comment
 */

exports.create = function (req, res) {
  var user = req.user
	var deck =  new Deck()
	console.log(req.body[0]);
	
	if (!req.body[0]) return res.redirect('/')
	
	var pres = req.body[0];
	var file_url = "https://s3.amazonaws.com/slidz_ppt/" + pres.key;
	
	//move to model: deck = new Deck(file_url)
	upload_slideshare(file_url, "test", function(xml) {
		parse_slide_id(xml, function(id) {
			get_slideshare(id, function(xml) {
				parse_slide_url(xml, function(url) {
					deck.name = pres.filename
					deck.fp_url = pres.url
					deck.filename = pres.filename
					deck.mimetype = pres.mimetype
					deck.size = pres.size
					deck.s3_key = pres.key
					deck.slideshare_id = Number(id)
					deck.slideshare_url = url

					deck.save(function (err) {
				    if (err)return console.error(err.stack)
						user.decks.push(deck)
						user.save(function (err) {
					    if (err) return console.error(err.stack)
							console.log('Successful insert in mongo obj_id: ' + deck._id);
							// return 200 with id.
							res.json({ id: deck._id });
					  });
				  });
				});
			});
		});
	});
}

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
			var id = result['SlideShowUploaded']['SlideShowID'][0]; //'17602611'
			callback(id);
	});
};

parse_slide_url = function(xml, callback){
	var parseString = require('xml2js').parseString;
	parseString(xml, function (err, result) {
			var url = result['Slideshow']['URL'][0]; //'http://www.slideshare.net/danielyanisse/test-17602611'
	    console.log(url);
			callback(url);
	});
};



