
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

let serverStats = {
    losses: 0,
    wins: 0
};

function analyzePatterns(history) {
    if (!history || history.length < 3) {
        return { prediction: "Big", patternName: "Default Safe Pattern" };
    }

    let recentSizes = history.map(h => h.size || h.bs);
    
    if (serverStats.losses > serverStats.wins) {
        let recoveryPred = recentSizes[0] === 'Big' ? 'Small' : 'Big';
        return { prediction: recoveryPred, patternName: "Loss Guard Recovery" };
    }

    if (recentSizes[0] !== recentSizes[1] && recentSizes[1] !== recentSizes[2]) {
        let altPred = recentSizes[0] === 'Big' ? 'Small' : 'Big';
        return { prediction: altPred, patternName: "Alternating Pattern" };
    }

    if (recentSizes[0] === recentSizes[1]) {
        let streakPred = recentSizes[0];
        return { prediction: streakPred, patternName: "Streak Momentum" };
    }

    let revPred = recentSizes[0] === 'Big' ? 'Small' : 'Big';
    return { prediction: revPred, patternName: "Dynamic Reversal" };
}

app.post('/api/get-pattern', (req, res) => {
    const { period, history, clientLosses, clientWins } = req.body;
    
    if (clientLosses !== undefined) serverStats.losses = clientLosses;
    if (clientWins !== undefined) serverStats.wins = clientWins;

    const result = analyzePatterns(history);

    res.json({
        period: period,
        prediction: result.prediction,
        patternName: result.patternName,
        status: "success"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Multi-Pattern Server running on port ${PORT}`);
});
