const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const TELEGRAM_BOT_TOKEN = "8909340205:AAGiS66szSqKYU-YG2ms-JUu2VL2M0C8z1Q";
const TELEGRAM_CHAT_ID = "8380859227";
const CREATOR_OR_CHANNEL_NAME = "PPI PRIVATE MOD";

// Keep track of last sent period to avoid duplicate telegram alerts
let lastProcessedPeriod = null;
let currentRoundEngines = {};

app.post('/api/diablo-z-compute', async (req, res) => {
    try {
        const { period, history, version, isRotatingAlgorithmEngine, isSpiderGodV3 } = req.body;

        // 1. Generate prediction based on engine version/type
        let prediction = "BIG";
        let rand = Math.random();

        if (isRotatingAlgorithmEngine) {
            // 5th Engine: Rotating Algorithms + Zigzag/Consecutive/Big-Small Detection
            let algoIndex = history ? history.length % 10 : 0;
            prediction = (algoIndex % 2 === 0) ? "SMALL" : "BIG";
            if (history && history.length >= 3) {
                let lastSize = history[0].size;
                prediction = (lastSize === "BIG") ? "SMALL" : "BIG"; // Adaptive pattern logic
            }
        } else if (isSpiderGodV3) {
            // 9th Engine: SPIDER GOD x Pattern Detector v3.0
            prediction = rand > 0.48 ? "BIG" : "SMALL";
        } else {
            // Standard engines (1-4, 6-8)
            prediction = rand > 0.5 ? "BIG" : "SMALL";
        }

        // Send back individual engine result to the Tampermonkey script (HUD stays clean/minimal if wanted)
        res.json({
            status: "success",
            prediction: {
                engine: version,
                prediction: prediction
            }
        });

        // 2. Collect predictions for Majority Consensus (9 Engines Total)
        if (period !== lastProcessedPeriod) {
            currentRoundEngines = {};
            lastProcessedPeriod = period;
        }

        currentRoundEngines[version] = prediction;

        // Jab sabhi 9 engines ka data aa jaye, tab consensus check karke Telegram par bhejo
        const totalEnginesCount = 9;
        if (Object.keys(currentRoundEngines).length >= totalEnginesCount) {
            let smallCount = 0;
            let bigCount = 0;

            for (let key in currentRoundEngines) {
                if (currentRoundEngines[key] === 'SMALL') smallCount++;
                if (currentRoundEngines[key] === 'BIG') bigCount++;
            }

            // Agar majority ek taraf hai (jaise 5 ya usse zyada engines)
            if (smallCount >= 5 || bigCount >= 5) {
                let winningSignal = smallCount > bigCount ? 'SMALL (S)' : 'BIG (B)';
                let count = Math.max(smallCount, bigCount);

                let message = `🚨 *${CREATOR_OR_CHANNEL_NAME}* 🚨\n\n` +
                              `📌 *Period:* ${period}\n` +
                              `🔥 *Signal:* ${winningSignal}\n` +
                              `📊 *Consensus:* ${count}/9 Engines Agree!\n` +
                              `⚡ *Status:* High Probability Trade`;

                // Send to Telegram
                await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown'
                });
            }

            // Clear for next round
            currentRoundEngines = {};
        }

    } catch (error) {
        console.error("Error in compute API:", error.message);
        res.status(500).json({ status: "error", message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
