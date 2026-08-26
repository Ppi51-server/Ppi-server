const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

let stats = { wins: 0, losses: 0 };

function getHighAccuracyPrediction(history) {
    if (!history || history.length < 5) {
        return { prediction: "Big", patternName: "Private AI Init" };
    }

    let sizes = history.map(h => h.size || h.bs);
    
    // High-Accuracy Loss Guard Mechanism
    if (stats.losses > stats.wins) {
        let safeCounter = sizes[0] === 'Big' ? 'Small' : 'Big';
        return { prediction: safeCounter, patternName: "Private Guard (Recovery)" };
    }

    // Momentum & Trend Streak Analysis
    let lastThree = sizes.slice(0, 3);
    if (lastThree[0] === lastThree[1] && lastThree[1] === lastThree[2]) {
        return { prediction: lastThree[0], patternName: "Private Momentum Streak" };
    }

    // Alternating Market Matrix Filter
    if (sizes[0] !== sizes[1] && sizes[1] !== sizes[2]) {
        let alternate = sizes[0] === 'Big' ? 'Small' : 'Big';
        return { prediction: alternate, patternName: "Private Alt Matrix" };
    }

    let defaultTrend = sizes[0] === 'Big' ? 'Small' : 'Big';
    return { prediction: defaultTrend, patternName: "Private Core Engine" };
}

app.post('/api/get-pattern', (req, res) => {
    const { period, history, clientLosses, clientWins } = req.body;
    
    if (clientLosses !== undefined) stats.losses = clientLosses;
    if (clientWins !== undefined) stats.wins = clientWins;

    const result = getHighAccuracyPrediction(history);

    res.json({
        period: period,
        prediction: result.prediction,
        patternName: result.patternName,
        status: "success"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Private Server running on port ${PORT}`);
});
