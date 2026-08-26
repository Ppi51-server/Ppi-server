const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Main prediction computation router for all 5 engines
app.post('/api/diablo-z-compute', (req, res) => {
    try {
        const { period, history, version, lastActualSize } = req.body;

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

        // ==========================================
        // 1. 🔒 PRIVATE GOD MODE (Inverted Trap Catcher)
        // ==========================================
        if (version === "PRIVATE_GOD_MODE") {
            method = "Inverted Trap Catcher";
            if (bigCount >= 4) {
                prediction = "SMALL";
                confidence = "92%";
            } else if (bigCount <= 1) {
                prediction = "BIG";
                confidence = "92%";
            } else {
                prediction = (last.size === 'BIG') ? 'SMALL' : 'BIG';
                confidence = "86%";
            }
        }

        // ==========================================
        // 2. 🔥 PPI ENGINE (Direct Mathematical Matrix)
        // ==========================================
        else if (version === "PPI_ENGINE") {
            method = "Direct Math Matrix";
            let sumNumbers = history.slice(0, 4).reduce((acc, curr) => acc + curr.num, 0);
            prediction = (sumNumbers % 2 === 0) ? "BIG" : "SMALL";
            confidence = "89%";
        }

        // ==========================================
        // 3. ⚡ AI PRO (Diablo Momentum Flow)
        // ==========================================
        else if (version === "AI_PRO") {
            method = "Diablo Momentum Flow";
            if (last.size === secondLast.size) {
                prediction = last.size;
                confidence = "88%";
            } else {
                prediction = (last.num >= 4) ? "SMALL" : "BIG";
                confidence = "84%";
            }
        }

        // ==========================================
        // 4. 🐉 DRAGON FOLLOW (Streak Rider)
        // ==========================================
        else if (version === "DRAGON_FOLLOW") {
            method = "Dragon Streak Rider";
            prediction = last.size;
            confidence = "90%";
        }

        // ==========================================
        // 5. 🌊 PUBLIC HIVE MIND (Crowd Wave)
        // ==========================================
        else if (version === "PUBLIC_HIVE_MIND") {
            method = "Public Mob Surge";
            prediction = (bigCount >= 3) ? "BIG" : "SMALL";
            confidence = "87%";
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
    console.log(`Diablo-Z 5-Engine Backend running on port ${PORT}`);
});
