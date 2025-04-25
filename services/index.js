// server/index.js
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;
const HOST_PORT = process.env.HOST_PORT || "unknown";
// const usersDB = require("../custom_gateway/user.tokenbucket.json");
const leakyBucket = require("./ratelimiting.leakybucket");

app.use(cors());
app.use(express.json());

app.get("/message", (req, res) => {
  res.json({
    message: `Hello from Node.js backend! Container port: ${PORT}, Host port: ${HOST_PORT}`,
  });
});

app.post("/upgrade/:id", (req, res) => {
  const user = usersDB.users.find((u) => u.id === req.params.id);
  if (user) {
    user.is_premium = true;
    user.is_free_expired = true;
    user.tokens_balance = 1000;
    user.rate_per_sec = 5;
    return res.json({ message: "User upgraded to premium!" });
  }
  res.status(404).json({ message: "User not found" });
});

app.get("/payments/process", leakyBucket, (req, res) => {
  // pretend to process payment
  res.json({ success: true, message: "Payment processed" });
});

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
