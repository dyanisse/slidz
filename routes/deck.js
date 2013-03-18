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
	console.log(req.body);
  res.send("file uploaded");
};
