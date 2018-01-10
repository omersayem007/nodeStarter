const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'You are now logged in!'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out! 👋');
  res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
  // first check if the user is authenticated
  if (req.isAuthenticated()) {
    next(); // carry on! They are logged in!
    return;
  }
  req.flash('error', 'Oops you must be logged in to do that!');
  res.redirect('/login');
};

exports.forgot = async (req, res) => {
  // 1. See if a user with that email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash('error', 'No account with that email exists.');
    return res.redirect("/login");
  }
  // if email exits store a password hash and a expires date in model
  user.resetPasswordHash=crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires=Date.now() + 3600000;
  await user.save();
  const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordHash}`;
  req.flash('success',`${resetURL}`);
  res.redirect("/login");
 
};

exports.reset =(req, res)=>{

  res.render("reset");
}
