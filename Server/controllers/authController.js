const passport = require('passport');
const User = require('../models/users');

exports.googleLogin = passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] });

exports.googleCallback = passport.authenticate('google', {
  failureRedirect: '/',
  successRedirect: '/'
});

exports.facebookLogin = passport.authenticate('facebook');

exports.facebookCallback = passport.authenticate('facebook', {
  failureRedirect: '/',
  successRedirect: '/'
});

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

const saveUserToDB = (profile, done) => {
  const newUser = new User({
    username: profile.displayName,
    email: profile.emails[0].value,
    role: 'customer', // Set the default role
  });

  newUser.save((err) => {
    if (err) {
      return done(err);
    }
    return done(null, newUser);
  });
};

passport.use(new GoogleStrategy({
  clientID: 'YOUR_GOOGLE_CLIENT_ID',
  clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
  callbackURL: 'http://localhost:3000/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  // Tìm kiếm hoặc tạo người dùng mới
  User.findOne({ email: profile.emails[0].value }, (err, existingUser) => {
    if (err) {
      return done(err);
    }

    if (existingUser) {
      return done(null, existingUser);
    }

    // Lưu người dùng mới vào MongoDB
    saveUserToDB(profile, done);
  });
}));

passport.use(new FacebookStrategy({
  clientID: 'YOUR_FACEBOOK_APP_ID',
  clientSecret: 'YOUR_FACEBOOK_APP_SECRET',
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, (accessToken, refreshToken, profile, done) => {
  // Tìm kiếm hoặc tạo người dùng mới
  User.findOne({ email: profile.emails[0].value }, (err, existingUser) => {
    if (err) {
      return done(err);
    }

    if (existingUser) {
      return done(null, existingUser);
    }

    // Lưu người dùng mới vào MongoDB
    saveUserToDB(profile, done);
  });
}));
