const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv/config"); // Environment variables

// Suppress Mongoose deprecation warnings
mongoose.set('strictQuery', false);

console.log("🚀 Starting API Test Suite Application...");

// Route imports
const homeRoutes = require("./routes/home");
const authRoutes = require("./routes/auth");
const privateRoutes = require("./routes/privateRoutes");
const paginationExample = require("./routes/examples/paginationExample");
const testRoutes = require("./routes/test");
const limiter = require("./middlewares/rateLimiter");

// Constants
const EXAMPLES_ROUTE = "/api/examples";

// View engine setup
console.log("⚙️  Setting up EJS view engine...");
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
console.log("📁 Setting up static files...");
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Debug middleware
app.use((req, res, next) => {
    console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Route Middlewares
console.log("🛣️  Setting up routes...");
app.use("/", homeRoutes);
app.use("/api/private", privateRoutes);
app.use("/api/user", authRoutes);
app.use("/test", testRoutes);
app.use(`${EXAMPLES_ROUTE}/pagination`, paginationExample);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Error occurred:', err.message);
    res.status(500).json({ error: 'Internal server error', message: err.message });
});

// 404 handler
app.use((req, res) => {
    console.log(`🔍 404 - Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ error: 'Route not found' });
});

// Connect to Database
if (process.env.DB_URL) {
    console.log("🔌 Connecting to database...");
    mongoose.connect(process.env.DB_URL)
        .then(() => {
            console.log("✅ Connected to Database");
        })
        .catch((error) => {
            console.error("❌ Database connection error:", error.message);
        });
} else {
    console.error("❌ DB_URL not found in environment variables");
}

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("\n🎉 Application Started Successfully!");
    console.log(`🌐 Server: http://localhost:${PORT}/`);
    console.log(`🧪 Test Suite: http://localhost:${PORT}/test`);
    console.log(`📊 Test Results: http://localhost:${PORT}/test/results`);
    console.log("\n✨ Ready to run tests!\n");
});

module.exports = app;