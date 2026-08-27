const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Smart Prediction Engine Logic
function calculatePrediction(version, history) {
    let prediction = "BIG";
    let confidence = "High";

    // Agar history data available hai toh uske base par analyze karein
    if (history && history.length > 0) {
        let lastNumbers = history.slice(0, 5).map(h => h.num);
        let avg = lastNumbers.reduce((a, b) => a + b, 0) / lastNumbers.length;

        // Alag-alag engines ke liye thoda alag variation logic
        if (version === "SPIDER_GOD" || version === "PUBLIC_HIVE_MIND") {
            prediction = avg >= 4.7 ? "BIG" : "SMALL";
        } else if (version === "DRAGON_FOLLOW") {
            prediction = lastNumbers[0] >= 5 ? "BIG" : "SMALL";
        } else {
            // General balanced logic
            prediction = avg >= 4.5 ? "BIG" : "SMALL";
        }

        // Agar streak ya pattern match ho toh random shift denge taaki accuracy real lage
        if (Math.random() > 0.85) {
            prediction = prediction === "BIG" ? "SMALL" : "BIG";
        }
    } else {
        // Fallback random agar history na ho
        prediction = Math.random() > 0.5 ? "BIG" : "SMALL";
    }

    return {
        prediction: prediction,
        confidence: confidence,
        engineVersion: version
    };
}

// API Endpoint jo aapki Tampermonkey script hit karegi
app.post('/api/diablo-z-compute', (req, res) => {
    try {
        const { period, history, version } = req.body;
        
        if (!version) {
            return res.status(400).json({ status: "error", message: "Engine version is required" });
        }

        const result = calculatePrediction(version, history);

        res.json({
            status: "success",
            period: period || "N/A",
            prediction: result
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// Health check route taaki server sleep na kare
app.get('/', (req, res) => {
    res.send("Diablo-Z Powerful Backend is Running Live!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
