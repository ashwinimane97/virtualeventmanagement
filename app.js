require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require("./routes/authRoutes");
const preferenceRoutes = require("./routes/preferencesRoutes");
const eventRoutes = require("./routes/eventsRoutes");
const connectDB = require('./dbConnect');
const { getRedisClient, connectRedis } = require('./redisConnect');

// connect to NoSQL DB.
connectDB();

// connect to Redis
connectRedis();

let client = getRedisClient();

const clearCache = async (key) => {
    try {
        const keys = await client.keys(key);
        if (keys.length) await client.del(...keys);
    } catch (error) {
        console.error('Error clearing cache:', error);
        // Re-throw the error to be handled by the calling function
        throw new Error('Error clearing cache');
    }

}

clearCache('*'); // Clear cache for all events
console.log("Redis client in authController:", client); // Check if the Redis client is available

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", authRoutes);
app.use("/events", eventRoutes);


module.exports = app;