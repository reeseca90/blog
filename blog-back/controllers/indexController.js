// import necessary models
const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
require('dotenv').config();
const LocalStrategy = require('passport-local');

// passport functions for login

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) { 
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user)
        } else {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" });
        }
      })
      return done(null, user);
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
/* 
// home page
exports.home = function(req, res, next) {
  res.send({ title: 'Home Page', user: req.user });
}
 */
// login page GET
exports.login_get = function(req, res, next) {
  res.send({ title: 'Log In' });
}


// login page POST
exports.login_post = passport.authenticate('local', {
    successRedirect: '/create/posts',
    failureRedirect: '/login'
});

/* 
// signup get and post
exports.signup_get = function(req, res, next) {
  res.render('signupform', { title: 'Sign Up' });
}

exports.signup_post = function(req, res, next) {
  bcrypt.hash(req.body.password, 5, (err, hashedPassword) => {
    const user = new User(
      {
        username: req.body.username,
        password: hashedPassword
    }).save(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  });
}
 */