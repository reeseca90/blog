// import necessary models
const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
require('dotenv').config();
const LocalStrategy = require('passport-local');
const jwt = require('jsonwebtoken');

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
          jwt.sign({user}, process.env.SECRET, (err, token) => {
            console.log(token);
            res.send({token})
          });
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

// login page GET
exports.login_get = function(req, res, next) {
  res.send({ title: 'Log In' });
}


// login page POST
exports.login_post = passport.authenticate('local',
  function(req, res) {
    console.log(res);
  }
);

// logout
exports.logout = (req, res) => {
  req.logout();
  res.redirect("/");
}

