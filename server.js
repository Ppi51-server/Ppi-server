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
        // 5 ORIGINAL ENGINES
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
