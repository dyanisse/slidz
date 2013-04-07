var mongoose = require('mongoose')
  , User = mongoose.model('User')


/*
 * GET home page.
 */

exports.index = function(req, res){
	var user = req.user
	User.findOne({_id: user._id}).populate('decks').exec(function (err, user) {
	  if (err) return console.error(err.stack)
	  console.log('The creator is %s', user.decks[0]);
	  // prints "The creator is Aaron"
	  res.render('index', { title: 'Slidz', name: user.name, decks: user.decks });
	})
};