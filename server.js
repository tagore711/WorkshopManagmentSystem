const express = require("express");
require("dotenv").config();
const db = require("./db"); 
const cors = require("cors"); 

// --- ROUTE IMPORTS ---
const aicRoutes = require('./routes/aicRoutes'); 
const workshopRoutes = require('./routes/workshopRoutes');
const wkicRoutes = require('./routes/wkicRoutes');
// ---

const app = express();
const PORT = process.env.PORT || 3000;

// --- CORS CONFIGURATION (Standard Setup) ---
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*', // Allow all origins in production or specify your deployed frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};
app.use(cors(corsOptions));
// ----------------------------

// Middleware for parsing JSON bodies
app.use(express.json());

// --- API ROUTE MOUNTING ---

// CRITICAL FIX: Mount more specific paths before general paths to prevent route confusion.
// Revenue PUT routes are now safe from misinterpretation.
app.use('/api/workshops', workshopRoutes);  // Must be mounted early to cover specific /revenue PUT
app.use('/api/aics', aicRoutes);         
app.use('/api/wics', wkicRoutes);        

// ------------------------------

// Basic Route for testing the server
app.get("/", (req, res) => {
  res.send("KTM Workshop Management API is running. All backend routes are active.");
});

// A test route to query the database and verify connection
app.get("/db-test", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM area_incharge LIMIT 1");
    res.status(200).json({
      message: "Database connection successful. Data preview:",
      data: result.rows,
    });
  } catch (err) {
    console.error("Error running DB test query:", err.message);
    res.status(500).json({
      message: "Database test failed. Check server logs and DB credentials.",
      error: err.message,
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
