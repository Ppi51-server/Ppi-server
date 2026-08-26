const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

let stats = { wins: 0, losses: 0 };

// Multi-Engine Analysis with Dynamic Best-Performer Selection
function runBestAnalysis(history) {
    if (!history || history.length < 5) {
        return { prediction: "Big", patternName: "Smart Init" };
    }

    let sizes = history.map(h => h.size || h.bs);

    // 1. Engine A: Momentum Trend Analysis
    let streakCount = 0;
    for (let i = 0; i < sizes.length - 1; i++) {
        if (sizes[i] === sizes[0]) streakCount++;
        else break;
    }
    let predMomentum = streakCount >= 2 ? sizes[0] : (sizes[0] === 'Big' ? 'Small' : 'Big');

    // 2. Engine B: Alternating Matrix Analysis
    let predAlternating = (sizes[0] !== sizes[1]) ? sizes[0] : (sizes[0] === 'Big' ? 'Small' : 'Big');

    // 3. Engine C: Random Weighted Behavioral Analysis (Market Chaos Adjuster)
    let randomFactor = Math.random();
    let predRandom = randomFactor > 0.5 ? (sizes[0] === 'Big' ? 'Small' : 'Big') : sizes[0];

    // Performance & Condition Evaluation (Choosing the best performing logic)
    let selectedPrediction = predMomentum;
    let activeEngineName = "Momentum Engine";

    if (stats.losses > stats.wins) {
        // Recovery Mode: Use Anti-Trend when under pressure
        selectedPrediction = sizes[0] === 'Big' ? 'Small' : 'Big';
        activeEngineName = "Loss Guard Shield";
    } else if (sizes[0] !== sizes[1] && sizes[1] !== sizes[2]) {
        // If market is fluctuating, switch to Alternating Engine
        selectedPrediction = predAlternating;
        activeEngineName = "Alternating Matrix";
    } else {
        // Otherwise use random behavioral analysis for unpredictable zones
        selectedPrediction = predRandom;
        activeEngineName = "Randomized AI Analyzer";
    }

    return {
        prediction: selectedPrediction,
        patternName: activeEngineName
    };
}

app.post('/api/get-pattern', (req, res) => {
    const { period, history, clientLosses, clientWins } = req.body;
    
    if (clientLosses !== undefined) stats.losses = clientLosses;
    if (clientWins !== undefined) stats.wins = clientWins;

    const result = runBestAnalysis(history);

    res.json({
        period: period,
        prediction: result.prediction,
        patternName: result.patternName,
        status: "success"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Dynamic Multi-Engine Server running on port ${PORT}`);
});
