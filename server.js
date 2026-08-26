const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

let stats = { wins: 0, losses: 0 };

function runDVXMEngine(history) {
    if (!history || history.length < 5) {
        return { prediction: "BIG", level: "LVL 01", patternName: "CORE INIT" };
    }

    let sizes = history.map(h => h.size || h.bs);
    let isUnderPressure = stats.losses > stats.wins;

    // Level & Prediction Matrix
    let level = isUnderPressure ? "LVL 02" : "LVL 01";
    let pred = "BIG";

    if (sizes[0] === sizes[1] && sizes[1] === sizes[2]) {
        pred = sizes[0];
    } else {
        pred = sizes[0] === 'BIG' ? 'SMALL' : 'BIG';
    }

    if (isUnderPressure && stats.losses - stats.wins >= 2) {
        pred = pred === 'BIG' ? 'SMALL' : 'BIG';
        level = "LVL 02";
    }

    return {
        prediction: pred.toUpperCase(),
        level: level,
        patternName: isUnderPressure ? "DVXM RECOVERY" : "DVXM QUANT CORE"
    };
}

app.post('/api/get-pattern', (req, res) => {
    const { period, history, clientLosses, clientWins } = req.body;
    
    if (clientLosses !== undefined) stats.losses = clientLosses;
    if (clientWins !== undefined) stats.wins = clientWins;

    const result = runDVXMEngine(history);

    res.json({
        period: period,
        prediction: result.prediction,
        level: result.level,
        patternName: result.patternName,
        status: "success"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`DVXM Core Server running on port ${PORT}`);
});
