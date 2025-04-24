// generateServiceMap.js
const fs = require("fs");
const path = require("path");

const swaggerDir = path.join(__dirname, "..", "swagger");
const outputFile = path.join(__dirname, "config", "service.js");

const services = [];

fs.readdirSync(swaggerDir).forEach((file) => {
  if (file.endsWith(".json")) {
    const swagger = JSON.parse(
      fs.readFileSync(path.join(swaggerDir, file), "utf8")
    );

    const host = swagger.host || "http://localhost:3000"; // fallback
    const basePath = swagger.basePath || "/";

    const target = `${host}`;
    const route = basePath;

    const windowMs = swagger.ratelimiting.windowMs;
    const limit = swagger.ratelimiting.limit;

    services.push({ route, target, limit, windowMs });
  }
});

const output = `const services = ${JSON.stringify(
  services,
  null,
  2
)};\n\nmodule.exports = services;\n`;

fs.writeFileSync(outputFile, output, "utf8");

console.log("✅ Generated service.js with routes from Swagger JSONs.");
