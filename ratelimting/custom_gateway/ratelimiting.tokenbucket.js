const usersDB = require("./user.tokenbucket.json");
const slidingWindowLogs = {}; // userId -> [timestamps]

const PREMIMUM_REQUEST = 5;
const FREE_REQUEST = 5;

function combinedRateLimiter(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) {
    return res.status(401).json({ message: "Missing API Key" });
  }

  const user = usersDB.users.find((u) => u.x_token === apiKey);
  if (!user) {
    return res.status(403).json({ message: "Invalid API Key" });
  }

  const now = Date.now();
  const userId = user.id;
  const maxRequestsPerHour = user.is_premium ? PREMIMUM_REQUEST : FREE_REQUEST;
  const windowSize = 60 * 60 * 1000; // 1 hour
  console.log(user, "user");
  console.log(slidingWindowLogs, "slidingWindowLogs");
  // === Sliding Window Logic ===
  if (!slidingWindowLogs[userId]) {
    slidingWindowLogs[userId] = [];
  }

  slidingWindowLogs[userId] = slidingWindowLogs[userId].filter(
    (timestamp) => now - timestamp <= windowSize
  );

  if (slidingWindowLogs[userId].length >= maxRequestsPerHour) {
    return res.status(429).json({
      message: "Too many requests (Sliding Window - Hourly Limit)",
    });
  }

  slidingWindowLogs[userId].push(now);

  // === Token Bucket Logic ===
  refillTokens(user, now);
  if (user.tokens_balance > 0) {
    user.tokens_balance -= 1;
    next();
  } else {
    return res.status(429).json({
      message: "Rate limit exceeded (Token Bucket)",
    });
  }
}

function refillTokens(user, now) {
  const elapsed = (now - (user.last_refill || 0)) / 1000;
  const tokensToAdd = Math.floor(
    elapsed * (user.allowed_request / user.seconds)
  );
  const maxTokens = user.is_premium ? PREMIMUM_REQUEST : FREE_REQUEST;

  if (tokensToAdd > 0) {
    user.tokens_balance = Math.min(
      user.tokens_balance + tokensToAdd,
      maxTokens
    );
    user.last_refill = now;
  }
}

module.exports = combinedRateLimiter;

// ✅ Why both Sliding Window + Token Bucket?
// This check adds burst protection:

// Sliding window limits total requests per hour (e.g., 1000/hour for premium)

// Token bucket prevents short-term bursts, like making 1000 requests in 10 seconds

// Let me know if you want to simulate this with logs!

// Algorithm	Controls what?
// Sliding Window	Total number of requests over time (hourly)
// Token Bucket	Short-term burst requests (per second/minute)

// use silding window and to
