
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , fs = require('fs')
  , path = require('path')
	, mongo = require('mongodb')
	, mongoose = require('mongoose')
	, config = require('./config')
	, passport = require('passport');
	
var models_path = __dirname + '/models';
fs.readdirSync(models_path).forEach(function (file) {
	 require(models_path+'/'+file);
});

var app = express();

var routes = require('./routes')
, user = require('./routes/user')
, deck = require('./routes/deck');

/**
 * App configuration
 */

app.configure(function(){
  app.set('port', process.env.PORT || 5000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.cookieParser());
	app.use(express.session({ secret: config.express.session_secret }));
  app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/**
 * App routes
 */

app.get('/', routes.index);
app.post('/decks', deck.create);
app.get('/decks/:id', deck.show);
app.put('/decks/:id', deck.update);
app.get('/login', user.login);
app.get('/signup', user.signup);
app.get('/logout', user.logout);
app.get('/users/:userId', user.show);
app.get('/auth/twitter', passport.authenticate('twitter', { failureRedirect: '/login' }), user.signin);
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), user.authCallback);
app.param('userId', user.user)

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


/**
 * Mongo config
 */

var mongoUri = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/mydb';
mongoose.connect(mongoUri);



/**
 * Passport authentication
 */

var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy;

var User = mongoose.model('User');

passport.use(new TwitterStrategy({
    consumerKey: config.twitter.consumer_key,
    consumerSecret: config.twitter.consumer_secret,
    callbackURL: "http://localhost:5000/auth/twitter/callback"
  },

  function(token, tokenSecret, profile, done) {
    User.findOne({ 'twitter.id': profile.id }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        user = new User({
            name: profile.displayName
          , username: profile.username
          , provider: 'twitter'
          , twitter: profile._json
        });
        user.save(function (err) {
          if (err) console.log(err);
          return done(err, user);
        });
      }
      else {
				console.log("user signed in: "+JSON.stringify(user))
        return done(err, user);
      }
    });
  }
));

// serialize sessions
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({ _id: id }, function (err, user) {
    done(err, user);
  });
});
