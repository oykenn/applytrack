const express = require("express");
const cors = require("cors");
const pool = require("./db");

const authRoutes = require("./routes/authRoutes");
const requireAuth = require("./middleware/authMiddleware");
const applicationRoutes = require("./routes/applicationRoutes");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/applications", applicationRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ApplyTrack backend is running",
  });
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      message: "Database connected successfully",
      time: result.rows[0],
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});


app.get("/protected", requireAuth, (req, res) => {
  res.json({
    success: true,
    message: "You are authorized",
    user: req.user,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});