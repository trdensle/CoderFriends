var express = require('express');
var session = require('express-session');
var request = require('request');
var bodyParser = require('body-parser');
var GitHubApi = require('github');
var passport = require('passport');
var PassGit = require('passport-github').Strategy;
var port = 9998;

var github = new GitHubApi({
	version: '3.0.0',
	protocol: 'https'
});

var accessToken;
var freshToken;

var app = express();

//middleware
app.use(session({secret: 'mySecret'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

var youShallPass = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(403).end();
  }
  return next();
}

passport.use(new PassGit({

	clientID: '81e739e4de8a2a51c653',
	clientSecret: '6505f8dc7d8defb0cf36ecdbcee33e0a5b148573',
	callbackURL: 'http://localhost:9998/auth/github/callback'
}, function(token, refreshToken, user, done) {
		acessToken = token;
		freshToken = refreshToken;
		return done (null, user);

}));



passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

//tests authentication
app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback', passport.authenticate('github', {
	successRedirect: '/',
	failureRedirect: '/home.html'
}));

app.get('/api/github/:username/activity', youShallPass, function(req, res){
	request.get({
		url: 'https//api.github.com/users/' + req.param('username') + '/events',
		headers: {'User-Agent': 'CodeFriendApp'}},
			function(error, response) {
				res.status(200).send(response.body);
				if(error) console.log(error);
	})
})


app.listen(port, function() {
	console.log('Now listening on ' + port)
})