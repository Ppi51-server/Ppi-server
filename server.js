const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

// Root test route
app.get('/', (req, res) => {
    res.send('Diablo-Z Powerful Backend is Running Live!');
});

// Live Sync Data Route
app.get('/get-data', (req, res) => {
    res.json({
        round: "20260917001",
        prediction: "Green",
        time: new Date().toLocaleTimeString()
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
