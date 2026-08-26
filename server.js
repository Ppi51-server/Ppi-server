const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

let stats = { wins: 0, losses: 0 };

// Advanced AI Scoring Engine for High Accuracy
function runAIEngine(history) {
    if (!history || history.length < 5) {
        return { prediction: "Big", patternName: "AI Core Warming" };
    }

    let sizes = history.map(h => h.size || h.bs);
    
    // Loss Guard Protection Mode
    if (stats.losses > stats.wins + 1) {
        let antiTrend = sizes[0] === 'Big' ? 'Small' : 'Big';
        return { prediction: antiTrend, patternName: "AI Recovery Shield" };
    }

    let bigScore = 0;
    let smallScore = 0;

    // Weighted Recency Analysis (Recent results have higher AI weight)
    const weights = [3.0, 2.2, 1.6, 1.2, 1.0];
    for (let i = 0; i < Math.min(5, sizes.length); i++) {
        let w = weights[i] || 1.0;
        if (sizes[i] === 'Big') {
            bigScore += w;
        } else {
            smallScore += w;
        }
    }

    // Pattern Intelligence Matrix
    let aiPrediction = bigScore >= smallScore ? "Small" : "Big"; // Mean Reversion AI Logic
    let aiPatternName = "AI Smart Quant Matrix";

    // Streak Momentum Detection
    if (sizes[0] === sizes[1] && sizes[1] === sizes[2]) {
        aiPrediction = sizes[0]; // Follow momentum if strong streak
        aiPatternName = "AI Momentum Neural";
    }

    return { 
        prediction: aiPrediction, 
        patternName: aiPatternName 
    };
}

app.post('/api/get-pattern', (req, res) => {
    const { period, history, clientLosses, clientWins } = req.body;
    
    if (clientLosses !== undefined) stats.losses = clientLosses;
    if (clientWins !== undefined) stats.wins = clientWins;

    const result = runAIEngine(history);

    res.json({
        period: period,
        prediction: result.prediction,
        patternName: result.patternName,
        status: "success"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`AI Quant Server running on port ${PORT}`);
});
