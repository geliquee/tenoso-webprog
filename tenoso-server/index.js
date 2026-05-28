require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const articleRoutes = require("./routes/articleRoutes");

const app = express();

// ─── Database Connection ──────────────────────────────────────────────────────
connectDB();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ─── CORS ─────────────────────────────────────────────────────────────────────
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:4173',
        process.env.CLIENT_URL,
    ].filter(Boolean),
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    optionsSuccessStatus: 204,
};
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// ─── Headers Middleware ───────────────────────────────────────────────────────
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL || '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/users", userRoutes);
app.use("/api/articles", articleRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.json({ message: "Tenoso API is running." });
});

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Server Error" });
});

// ─── Local Dev Server ─────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// ─── Export for Vercel ────────────────────────────────────────────────────────
module.exports = app;