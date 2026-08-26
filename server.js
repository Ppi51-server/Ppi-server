const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

let stats = { wins: 0, losses: 0 };

function analyzeWithAccuracy(history) {
    if (!history || history.length < 5) {
        return { prediction: "Big", patternName: "Warming Up", confidence: 50, digitProb: 40 };
    }

    let sizes = history.map(h => h.size || h.bs);

    // Dynamic Accuracy & Performance Tracker
    let isUnderLossPressure = stats.losses > stats.wins;

    // Agar losses zyada hain, toh smart skip ya safe counter mode trigger karein
    if (isUnderLossPressure && stats.losses - stats.wins >= 2) {
        return { 
            prediction: "SKIP", 
            patternName: "Loss Guard Skip", 
            confidence: 20, 
            digitProb: 10 
        };
    }

    let lastThree = sizes.slice(0, 3);
    let prediction = "Big";
    let patternName = "AI Trend Engine";
    let confidence = 88;
    let digitProb = 85;

    // Momentum vs Reversal Check
    if (lastThree[0] === lastThree[1] && lastThree[1] === lastThree[2]) {
        prediction = lastThree[0];
        patternName = "Momentum Streak";
        confidence = 92;
        digitProb = 90;
    } else if (lastThree[0] !== lastThree[1]) {
        prediction = lastThree[0] === 'Big' ? 'Small' : 'Big';
        patternName = "Alternating Matrix";
        confidence = 86;
        digitProb = 82;
    } else {
        prediction = sizes[0] === 'Big' ? 'Small' : 'Big';
        patternName = "Smart Reversal";
        confidence = 84;
        digitProb = 78;
    }

    return {
        prediction: prediction,
        patternName: patternName,
        confidence: confidence,
        digitProb: digitProb
    };
}

app.post('/api/get-pattern', (req, res) => {
    const { period, history, clientLosses, clientWins } = req.body;
    
    if (clientLosses !== undefined) stats.losses = clientLosses;
    if (clientWins !== undefined) stats.wins = clientWins;

    const result = analyzeWithAccuracy(history);

    res.json({
        period: period,
        prediction: result.prediction,
        patternName: result.patternName,
        confidence: result.confidence,
        digitProb: result.digitProb,
        status: "success"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Smart Accuracy Server running on port ${PORT}`);
});
