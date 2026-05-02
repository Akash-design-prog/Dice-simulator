const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allows the frontend to talk to this server
app.use(express.json());

// In-memory history (resets when server restarts)
let rollHistory = [];

// Route: Roll the dice
app.get('/api/roll', (req, res) => {
    const roll = Math.floor(Math.random() * 6) + 1;
    
    // Add to history (keep only last 10)
    rollHistory.unshift({
        value: roll,
        timestamp: new Date().toLocaleTimeString()
    });
    if (rollHistory.length > 10) rollHistory.pop();

    console.log(`New roll: ${roll}`);
    res.json({ result: roll });
});

// Route: Get history
app.get('/api/history', (req, res) => {
    res.json(rollHistory);
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Backend server running on http://localhost:${PORT}`);
    });
}

module.exports = app;