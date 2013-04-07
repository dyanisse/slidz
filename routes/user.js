
/*
 * GET users listing.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')


	exports.signin = function (req, res) {}

	/**
	 * Auth callback
	 */

	exports.authCallback = function (req, res, next) {
	  res.redirect('/')
	}

	/**
	 * Show login form
	 */

	exports.login = function (req, res) {
	  res.render('login', {
	    title: 'Welcome to Slidz',
	    //message: req.flash('error')
	  })
	}


	/**
	 * Logout
	 */

	exports.logout = function (req, res) {
	  req.logout()
	  res.redirect('/login')
	}

	/**
	 * Session
	 */

	exports.session = function (req, res) {
	  res.redirect('/')
	}
	
	exports.show = function (req, res) {
	  var user = req.profile
	  res.render('users/show', {
	    title: user.name,
	    user: user
	  })
	}

	/**
	 * Find user by id
	 */

	exports.user = function (req, res, next, id) {
	  User
	    .findOne({ _id : id })
	    .exec(function (err, user) {
	      if (err) return next(err)
	      if (!user) return next(new Error('Failed to load User ' + id))
	      req.profile = user
	      next()
	    })
	}