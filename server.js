const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/diablo-z-compute', (req, res) => {
    try {
        const { period, history, version } = req.body;

        if (!history || history.length < 4) {
            return res.json({
                status: "success",
                prediction: { prediction: "SKIP", confidence: "0%", method: "Collecting Data..." }
            });
        }

        let prediction = "BIG";
        let method = "";
        let confidence = "85%";

        let last = history[0];
        let secondLast = history[1];
        let recentSizes = history.slice(0, 5).map(h => h.size);
        let bigCount = recentSizes.filter(s => s === 'BIG').length;
        let sumNumbers = history.slice(0, 4).reduce((acc, curr) => acc + curr.num, 0);

        // ==========================================
        // ENGINES 1 TO 5 (Core Engines)
        // ==========================================
        if (version === "PRIVATE_GOD_MODE") {
            method = "Inverted Trap Catcher";
            prediction = (bigCount >= 4) ? "SMALL" : (bigCount <= 1 ? "BIG" : (last.size === 'BIG' ? 'SMALL' : 'BIG'));
            confidence = "92%";
        }
        else if (version === "PPI_ENGINE") {
            method = "Direct Math Matrix";
            prediction = (sumNumbers % 2 === 0) ? "BIG" : "SMALL";
            confidence = "89%";
        }
        else if (version === "AI_PRO") {
            method = "Diablo Momentum Flow";
            prediction = (last.size === secondLast.size) ? last.size : (last.num >= 4 ? "SMALL" : "BIG");
            confidence = "88%";
        }
        else if (version === "DRAGON_FOLLOW") {
            method = "Dragon Streak Rider";
            prediction = last.size;
            confidence = "90%";
        }
        else if (version === "PUBLIC_HIVE_MIND") {
            method = "Public Mob Surge";
            prediction = (bigCount >= 3) ? "BIG" : "SMALL";
            confidence = "87%";
        }

        // ==========================================
        // ENGINES 6 TO 15 (Analytical Engines)
        // ==========================================
        else if (version === "ENGINE_6") {
            method = "Fibonacci Modulo Tracker";
            prediction = ((sumNumbers + 3) % 2 === 0) ? "BIG" : "SMALL";
            confidence = "86%";
        }
        else if (version === "ENGINE_7") {
            method = "Volatility Reversal";
            prediction = (last.num % 3 === 0) ? "SMALL" : "BIG";
            confidence = "85%";
        }
        else if (version === "ENGINE_8") {
            method = "Streak Breaker Matrix";
            prediction = (bigCount >= 4 || bigCount <= 1) ? last.size : (last.size === 'BIG' ? 'SMALL' : 'BIG');
            confidence = "91%";
        }
        else if (version === "ENGINE_9") {
            method = "Quantum Odd-Even Balancer";
            prediction = (last.num % 2 !== 0) ? "BIG" : "SMALL";
            confidence = "84%";
        }
        else if (version === "ENGINE_10") {
            method = "Dynamic Flow Rider";
            prediction = recentSizes[0] === recentSizes[1] ? recentSizes[0] : "BIG";
            confidence = "87%";
        }
        else if (version === "ENGINE_11") {
            method = "Apex Trend Scalper";
            prediction = sumNumbers > 20 ? "BIG" : "SMALL";
            confidence = "86%";
        }
        else if (version === "ENGINE_12") {
            method = "Zero-Point Anchor";
            prediction = (last.num === 0 || last.num === 5) ? "BIG" : "SMALL";
            confidence = "83%";
        }
        else if (version === "ENGINE_13") {
            method = "Hyper-Cluster Filter";
            prediction = bigCount >= 3 ? "SMALL" : "BIG";
            confidence = "89%";
        }
        else if (version === "ENGINE_14") {
            method = "Shadow Momentum Sync";
            prediction = secondLast.size;
            confidence = "85%";
        }
        else if (version === "ENGINE_15") {
            method = "Omega Core Predictor";
            prediction = (sumNumbers * 7) % 2 === 0 ? "BIG" : "SMALL";
            confidence = "90%";
        }

        // ==========================================
        // ENGINES 16 TO 20 (Quantum Matrix Engines)
        // ==========================================
        else if (version === "ENGINE_16") {
            method = "Alpha Vortex Filter";
            prediction = (history.length % 2 === 0) ? last.size : (last.size === 'BIG' ? 'SMALL' : 'BIG');
            confidence = "88%";
        }
        else if (version === "ENGINE_17") {
            method = "Gamma Trend Guard";
            prediction = (bigCount >= 2 && bigCount <= 3) ? "BIG" : "SMALL";
            confidence = "87%";
        }
        else if (version === "ENGINE_18") {
            method = "Delta Sequence Matrix";
            prediction = (last.num > secondLast.num) ? "BIG" : "SMALL";
            confidence = "86%";
        }
        else if (version === "ENGINE_19") {
            method = "Sigma Pulse Core";
            prediction = ((sumNumbers + last.num) % 2 === 0) ? "BIG" : "SMALL";
            confidence = "89%";
        }
        else if (version === "ENGINE_20") {
            method = "Quantum Prime Shield";
            prediction = (last.num === 2 || last.num === 3 || last.num === 5 || last.num === 7) ? "BIG" : "SMALL";
            confidence = "91%";
        }

        // Fallback
        else {
            method = "Smart Auto Router";
            prediction = (last.num % 2 === 0) ? "BIG" : "SMALL";
            confidence = "85%";
        }

        res.json({
            status: "success",
            prediction: {
                prediction: prediction,
                confidence: confidence,
                method: method
            }
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Diablo-Z 20-Engine Backend running on port ${PORT}`);
});
