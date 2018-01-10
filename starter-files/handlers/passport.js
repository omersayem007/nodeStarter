const passport =require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');


passport.use(User.createStrategy());

passport.serializeUser( User.serializeUser() ); //dont know what hack it does ??
passport.deserializeUser( User.deserializeUser() );