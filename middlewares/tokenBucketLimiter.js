const redis = require('../redisClient');

const MAX_TOKENS = 5;
const REFILL_RATE = 1; // tokens per second

async function tokenBucketLimiter(req, res, next) {
  const userId = req.headers['user-id'];

  if (!userId) {
    return res.status(400).send("user-id header required");
  }

  const key = `tokens:${userId}`;

  try {
    let bucket = await redis.get(key);

    let tokens = MAX_TOKENS;
    let lastRefill = Date.now();

    if (bucket) {
      bucket = JSON.parse(bucket);
      tokens = bucket.tokens;
      lastRefill = bucket.lastRefill;
    }

    const now = Date.now();
    const timePassed = (now - lastRefill) / 1000;

    const refill = Math.floor(timePassed * REFILL_RATE);
    tokens = Math.min(MAX_TOKENS, tokens + refill);

    if (tokens <= 0) {
      return res.status(429).send("Too many requests");
    }

    tokens -= 1;

    await redis.set(
      key,
      JSON.stringify({
        tokens,
        lastRefill: now
      })
    );

    next();

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}

module.exports = tokenBucketLimiter;