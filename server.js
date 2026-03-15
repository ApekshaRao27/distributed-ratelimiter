const express = require('express');
const Redis = require('ioredis'); 

const app = express();
const PORT = 3000;

const redis = new Redis(); // connected, but not used in this step

async function rateLimiter(req, res, next) {
  const userId = req.headers['user-id'];

  if (!userId) {
    return res.status(400).send('user-id header is required');
  }

  const now = Date.now();
  const WINDOW_SIZE = 60 * 1000; // 60 seconds
  const MAX_REQUESTS = 5;

  const key = `rate_limit:${userId}`;

  try{
    // Get timestamps from Redis
    let timestamps = await redis.lrange(key, 0, -1);
    timestamps = timestamps.map(Number);
    // remove old timestamps
    timestamps = timestamps.filter(
      (time) => now - time < WINDOW_SIZE
    );

    if (timestamps.length >= MAX_REQUESTS) {
      return res.status(429).send("Too many requests");
    }
    // add current request
    timestamps.push(now);
    // store updated list
    await redis.del(key);
    for (let t of timestamps) {
      await redis.rpush(key, t);
    }
    // set expiry so Redis auto cleans
    await redis.expire(key, 60);
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}

// Apply middleware to this route
app.get('/api/test', rateLimiter, (req, res) => {
  res.send('Request allowed!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
