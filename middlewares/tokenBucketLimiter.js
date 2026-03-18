const redisClient = require("../redisClient");

const MAX_TOKENS = 5;
const REFILL_RATE = 1 // tokens per second

async function tokenBucketLimiter(req, res, next) {
    const userKey = req.ip;
    const key = `token_bucket:${userKey}`;
    console.log("middleare hit", key);
    let bucket = await redisClient.get(key);

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
        return res.status(429).json({ message: "Rate limit exceeded" });
    }

    tokens -= 1;

    await redisClient.set(
        key,
        JSON.stringify({ tokens, lastRefill: now })
    );

    next();
}

module.exports = tokenBucketLimiter;