const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

function analyzePatterns(history) {
    if (!history || history.length < 3) {
        return { prediction: "Big", patternName: "Default Safe" };
    }

    let recentSizes = history.map(h => h.size);
    
    if (recentSizes[0] !== recentSizes[1] && recentSizes[1] !== recentSizes[2]) {
        let nextPred = recentSizes[0] === 'Big' ? 'Small' : 'Big';
        return { prediction: nextPred, patternName: "Alternating Pattern" };
    }

    if (recentSizes[0] === recentSizes[1]) {
        let nextPred = recentSizes[0];
        return { prediction: nextPred, patternName: "Streak Trend" };
    }

    let opposite = recentSizes[0] === 'Big' ? 'Small' : 'Big';
    return { prediction: opposite, patternName: "Reversal Logic" };
}

app.post('/api/get-pattern', (req, res) => {
    const { period, history } = req.body;
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
    console.log(`PPI51 Server running on port ${PORT}`);
});
