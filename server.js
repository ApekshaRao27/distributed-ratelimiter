const express = require('express');
const Redis = require('ioredis'); 

const app = express();
const PORT = 3000;

const redis = new Redis(); // connected, but not used in this step

// In-memory store
const rateLimitStore = {};

function rateLimiter(req, res, next) {
  const userId = req.headers['user-id'];

  if (!userId) {
    return res.status(400).send('user-id header is required');
  }

  const now = Date.now();
  const WINDOW_SIZE = 60 * 1000; // 60 seconds
  const MAX_REQUESTS = 5;

  if (!rateLimitStore[userId]) {
    rateLimitStore[userId] = [];
  }

  // Filter out timestamps older than window
  rateLimitStore[userId] = rateLimitStore[userId].filter(
    (timestamp) => now - timestamp < WINDOW_SIZE
  );

  if (rateLimitStore[userId].length >= MAX_REQUESTS) {
    return res.status(429).send('Too many requests, slow down!');
  }

  // Add current request timestamp
  rateLimitStore[userId].push(now);
  next();
}



// Apply middleware to this route
app.get('/api/test', rateLimiter, (req, res) => {
  res.send('Request allowed!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
