// =====================
// 🔒 Rate Limiting Setup
// =====================
const MAX_REQUESTS_PER_MINUTE = 20;
const TIME_WINDOW_MS = 60 * 1000;
const requestCounts = {};

setInterval(() => {
  Object.keys(requestCounts).forEach((ip) => (requestCounts[ip] = 0));
}, TIME_WINDOW_MS);

function rateLimitAndTimeout(req, res, next) {
  const ip = req.ip;
  requestCounts[ip] = (requestCounts[ip] || 0) + 1;

  if (requestCounts[ip] > MAX_REQUESTS_PER_MINUTE) {
    return res.status(429).json({
      code: 429,
      status: "Error",
      message: "Rate limit exceeded.",
      data: null,
    });
  }

  req.setTimeout(15000, () => {
    res.status(504).json({
      code: 504,
      status: "Error",
      message: "Gateway timeout.",
      data: null,
    });
  });

  next();
}

module.exports = rateLimitAndTimeout;
