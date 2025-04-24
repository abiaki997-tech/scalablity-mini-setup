const usersDB = require("./leakybucket.json");

const buckets = {}; // userId -> { queue: [], lastLeakTime }

const LEAK_RATE = 10000; // 1 request per second (1000ms)

function leakyBucketRateLimiter(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) {
    return res.status(401).json({ message: "Missing API Key" });
  }

  const user = usersDB.users.find((u) => u.x_token === apiKey);
  if (!user) {
    return res.status(403).json({ message: "Invalid API Key" });
  }

  const userId = user.id;

  if (!buckets[userId]) {
    buckets[userId] = {
      queue: [],
      lastLeakTime: Date.now(),
    };
  }

  const bucket = buckets[userId];
  const now = Date.now();
  const timeElapsed = now - bucket.lastLeakTime;

  // Leak one request per LEAK_RATE ms
  const leakedRequests = Math.floor(timeElapsed / LEAK_RATE);
  if (leakedRequests > 0) {
    bucket.queue.splice(0, leakedRequests); // remove oldest
    bucket.lastLeakTime = now;
  }

  // Max burst size allowed (set limit)
  const maxBucketSize = user.is_premium ? 5 : 2;

  if (bucket.queue.length >= maxBucketSize) {
    return res.status(429).json({
      message: "Too many requests (Leaky Bucket Overflow)",
    });
  }

  bucket.queue.push(now); // Add this request to the queue
  next();
}

module.exports = leakyBucketRateLimiter;

// Ensures smooth traffic to backend systems.

// Helps avoid burst spikes even from premium users.

// Keeps your system stable under stress.

// 💳 Real-World Scenario: Payment API
// 🔐 Context:
// You're building a payment processing API, and you want to protect it from:

// Sudden spikes (e.g. 1000 payment requests at once).

// Abusive users hitting the API too fast.

// Ensuring fair usage across free and premium users.
