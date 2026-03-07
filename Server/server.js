// app.js

const express = require('express');
const connectDB = require('./config/db');
const passport = require('passport');
const cors = require('cors');
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require('path');
const app = express();

dotenv.config();


// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://manga-2-client.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "token", "Authorization"],
}));

// Route for serving static assets explicitly
app.use('/public', express.static(path.join(__dirname, 'public')));

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Routes
const storiesRouter = require('./routes/stories');
const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users');
const genresRouter = require('./routes/genres');
const notificationRouter = require('./routes/noti');
const favoriteRouter = require('./routes/favorites')
const readHistoryRouter = require('./routes/history');
const storyErrorRouter = require('./routes/storyErorr');
const contactRoute = require("./routes/contact");
const commentRouter = require('./routes/comment');
const storyViewRouter = require('./routes/storyView');
const ratingRouter = require('./routes/rating');
const stickerRouter = require('./routes/stickers');

app.use("/api/contact", contactRoute);
app.use('/api/comment', commentRouter);
app.use('/api/stickers', stickerRouter);
app.use('/api/story', storiesRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', usersRouter);
app.use('/api/genre', genresRouter);
app.use('/api/noti', notificationRouter);
app.use('/api/favorites', favoriteRouter)
app.use('/api/history', readHistoryRouter)
app.use('/api/error', storyErrorRouter)
app.use('/api/views', storyViewRouter)
app.use('/api/rating', ratingRouter)


// Passport Routes


if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
