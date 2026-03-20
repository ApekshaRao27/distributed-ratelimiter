const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const tokenBucketLimiter = require("./middlewares/tokenBucketLimiter");
const rateLimiter =require("./middlewares/slidingWindowLimiter");

// Apply middleware to this route
app.get('/api/slidingwindow', rateLimiter, (req, res) => {
  res.send('sliding window Request allowed!');
});

app.get('/api/token-bucket', tokenBucketLimiter, (req, res) => {
  res.send('Token bucket request allowed!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
