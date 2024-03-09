// app.js

const express = require('express');
const connectDB = require('./config/db');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true,
}));
// Sử dụng middleware cors
app.use(cors());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Routes
const storiesRouter = require('./routes/stories');
const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users');
const genresRouter = require('./routes/genres');
const notificationRouter = require('./routes/noti');


app.use('/api/story', storiesRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', usersRouter);
app.use('/api/genre', genresRouter);
app.use('/api/noti', notificationRouter);
 


// Passport Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/');
});

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
