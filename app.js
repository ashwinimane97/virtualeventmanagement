require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require("./routes/authRoutes")
const preferenceRoutes = require("./routes/preferencesRoutes")
const connectDB = require('./dbConnect');

// connect to NoSQL DB.
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users/preferences", preferenceRoutes);
app.use("/users", authRoutes);

module.exports = app;