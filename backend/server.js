const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allows the frontend to talk to this server
app.use(express.json());

// Route: Roll the dice
app.get('/api/roll', (req, res) => {
    const roll = Math.floor(Math.random() * 6) + 1;
    console.log(`New roll: ${roll}`);
    res.json({ result: roll });
});

// Remove history route as it's now handled by the frontend

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Backend server running on http://localhost:${PORT}`);
    });
}

module.exports = app;