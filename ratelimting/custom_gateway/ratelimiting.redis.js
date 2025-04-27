const { RateLimiterRedis } = require("rate-limiter-flexible");
const Redis = require("ioredis");

// =====================
// 🔌 Redis Connection
// =====================
const redisClient = new Redis({
  host: "localhost",
  port: 6379,
  enableOfflineQueue: false,
});

// =====================
// 🔒 Rate Limiter Config
// =====================
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rlflx",
  points: 20, // 20 requests
  duration: 60, // per 60 seconds per IP
});

// =====================
// 🛡️ Middleware for Rate Limiting + Timeout
// =====================
const rateLimitMiddleware = async (req, res, next) => {
  const ip = req.ip;
  try {
    await rateLimiter.consume(ip); // consume 1 point for this IP
    req.setTimeout(15000, () => {
      res.status(504).json({
        code: 504,
        status: "Error",
        message: "Gateway timeout.",
        data: null,
      });
    });
    next();
  } catch (rejRes) {
    res.set("Retry-After", String(Math.ceil(rejRes.msBeforeNext / 1000)));
    res.status(429).json({
      code: 429,
      status: "Error",
      message: "Too many requests. Please try again later.",
      data: null,
    });
  }
};

module.exports = rateLimitMiddleware;
