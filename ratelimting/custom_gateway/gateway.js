//PACKAGES
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

//IMPORTS
require("./makeservice"); // Generates the service map from swagger JSON
const services = require("./config/service");
const ratelimitingservice = require("./ratelimiting.tokenbucket");

//CONSTAT
const app = express();
const PORT = 8000;

// =====================
// 📦 Logging Middleware
// =====================
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} from ${
      req.ip
    }`
  );
  next();
});

// =====================
// 🚀 Dynamic Proxies from Swagger Services
// =====================
services.forEach(({ route, target }) => {
  console.log(`🔁 Mapping route: ${route} → ${target}`);
  app.use(
    route,
    ratelimitingservice,
    createProxyMiddleware({
      target: "http://haproxy:8082",
      changeOrigin: true,
      pathRewrite: (path, req) => req.originalUrl,
    })
  );
});

// =====================
// 🟢 Start Server
// =====================
app.listen(PORT, () => {
  console.log(`✅ Custom API Gateway running on http://localhost:${PORT}`);
});
