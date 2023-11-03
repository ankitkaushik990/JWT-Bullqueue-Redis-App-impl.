const Redis = require("ioredis");
const { REDIS_HOST, REDIS_PORT } = require("../../config/env");

const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
});

redis
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((err) => {
    console.error("Error connecting to Redis:", err);
  });

module.exports = redis;
