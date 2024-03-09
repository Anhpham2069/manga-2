// app.js

const express = require('express');
const connectDB = require('./config/db');
const passport = require('passport');
const cors = require('cors');
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express();

dotenv.config();


// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
// app.use(session({
//   secret: 'your-secret-key',
//   resave: true,
//   saveUninitialized: true,
// }));
// Sử dụng middleware cors
app.use(cors());

// Passport middleware
app.use(passport.initialize());
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


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
