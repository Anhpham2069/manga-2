// app.js

const express = require('express');
const connectDB = require('./config/db');
const passport = require('passport');
const cors = require('cors');
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const app = express();

dotenv.config();


// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());
// app.use(session({
//   secret: 'your-secret-key',
//   resave: true,
//   saveUninitialized: true,
// }));
// Sử dụng middleware cors

// Passport middleware
// app.use(passport.initialize());
// body-parser middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(express.static("public"));
// app.use(express.urlencoded({ extended: false }));

// Routes
const storiesRouter = require('./routes/stories');
const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users');
const genresRouter = require('./routes/genres');
const notificationRouter = require('./routes/noti');
const favoriteRouter = require('./routes/favorites')
const readHistoryRouter = require('./routes/history');

app.use('/api/story', storiesRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', usersRouter);
app.use('/api/genre', genresRouter);
app.use('/api/noti', notificationRouter);
app.use('/api/favorites',favoriteRouter)
app.use('/api/history',readHistoryRouter)


// Passport Routes


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
