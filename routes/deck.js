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
														console.log('Success: ' + JSON.stringify(rs[0]));
														console.log('Success2: ' + rs[0]._id);
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