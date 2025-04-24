const services = require("./config/service"); // your array with route + limit + windowMs

// Store request timestamps: { 'APIKEY-/route': [timestamps...] }
const requestStore = {};

function ratelimitingservice(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  const now = Date.now();

  if (!apiKey) {
    return res.status(401).json({ message: "❌ API key missing" });
  }

  // Match incoming request to a service route
  const matchedService = services.find((service) =>
    req.originalUrl.startsWith(service.route)
  );

  if (!matchedService) {
    return next(); // No matching service, no limit applied
  }

  const { route, limit, windowMs } = matchedService;
  const key = `${apiKey}-${route}`;
  const timestamps = requestStore[key] || [];

  // Keep only timestamps within window
  const recentRequests = timestamps.filter((ts) => now - ts < windowMs);

  if (recentRequests.length >= limit) {
    return res.status(429).json({
      code: 429,
      status: "Error",
      message: `⏳ Rate limit exceeded for ${route} (max ${limit} per ${
        windowMs / 1000
      }s)`,
    });
  }

  // Save timestamp and continue
  recentRequests.push(now);
  requestStore[key] = recentRequests;

  next();
}

module.exports = ratelimitingservice;
