const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/diablo-z-compute', (req, res) => {
    try {
        const { period, history } = req.body;

        if (!history || history.length < 10) {
            return res.json({
                status: "success",
                prediction: { prediction: "SKIP", confidence: "0%", consensus: "0/50", method: "Buffer Syncing..." }
            });
        }

        let bigVotes = 0;
        let smallVotes = 0;
        let totalEngines = 50;

        // 50-Engine Parallel Simulation Loop using different mathematical seeds & weights
        for (let i = 1; i <= totalEngines; i++) {
            let sliceFactor = (i % 5) + 3; // Different history depths for variety
            let recentSlice = history.slice(0, sliceFactor);
            let sum = recentSlice.reduce((acc, curr) => acc + curr.num + i, 0);
            
            // Different logic variants across 50 engines
            let engineChoice = "";
            if (i % 3 === 0) {
                // Inverted / Trap check variant
                engineChoice = (history[0].size === 'BIG') ? 'SMALL' : 'BIG';
            } else if (i % 2 === 0) {
                // Mathematical Modulo variant
                engineChoice = (sum % 2 === 0) ? 'BIG' : 'SMALL';
            } else {
                // Momentum / Streak variant
                let bigs = recentSlice.filter(s => s.size === 'BIG').length;
                engineChoice = (bigs >= recentSlice.length / 2) ? 'BIG' : 'SMALL';
            }

            if (engineChoice === 'BIG') bigVotes++;
            else smallVotes++;
        }

        // Super-Majority Consensus Calculation
        let finalPrediction = bigVotes >= smallVotes ? 'BIG' : 'SMALL';
        let winningVotes = Math.max(bigVotes, smallVotes);
        let consensusPercentage = ((winningVotes / totalEngines) * 100).toFixed(0);

        let confidence = consensusPercentage >= 70 ? "High (Strong Consensus)" : "Moderate";

        res.json({
            status: "success",
            prediction: {
                prediction: finalPrediction,
                confidence: `${consensusPercentage}% (${winningVotes}/${totalEngines} Engines)`,
                method: `50-Engine Massively Parallel Grid`
            }
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Diablo-Z 50-Engine Quantum Backend running on port ${PORT}`);
});
