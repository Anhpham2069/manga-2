// app.js

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
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

// Debug/health check route
app.get('/', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
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

app.use("/api/contact", contactRoute);
app.use('/api/comment', commentRouter);
app.use('/api/story', storiesRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', usersRouter);
app.use('/api/genre', genresRouter);
app.use('/api/noti', notificationRouter);
app.use('/api/favorites', favoriteRouter)
app.use('/api/history', readHistoryRouter)
app.use('/api/error', storyErrorRouter)
app.use('/api/views', storyViewRouter)

// Only listen when running locally, not on Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
