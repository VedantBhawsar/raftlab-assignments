"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    url: "redis://localhost:6379",
});
exports.redisClient = redisClient;
redisClient.on("error", (err) => {
    console.error("Redis connection error:", err);
});
redisClient
    .connect()
    .then(() => {
    console.log("Connected to Redis");
})
    .catch((err) => {
    console.error("Redis connection failed:", err);
});
