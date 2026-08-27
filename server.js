const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const TELEGRAM_BOT_TOKEN = "8909340205:AAGiS66szSqKYU-YG2ms-JUu2VL2M0C8z1Q";
const TELEGRAM_CHAT_ID = "8380859227";
const CREATOR_OR_CHANNEL_NAME = "PPI PRIVATE MOD";

let totalWins = 0;
let totalLosses = 0;
let lastSignal = null;
let lastProcessedPeriod = null;

app.post('/api/diablo-z-compute', async (req, res) => {
    try {
        const { period, history } = req.body;

        // 50 Engines ka automated array generate karna aur unka prediction calculate karna
        let engineResults = {};
        let smallVotes = 0;
        let bigVotes = 0;

        for (let i = 1; i <= 50; i++) {
            let engineName = `Engine_${i}`;
            let prediction = "BIG";

            // Special logic for specific engines (jaise 5th, 25th, 50th Spider God/Rotating)
            if (i === 5) {
                // Rotating Pattern Engine
                let alt = history ? history.length % 2 : 0;
                prediction = alt === 0 ? "SMALL" : "BIG";
            } else if (i === 50) {
                // Spider God v3.0 Ultimate Engine
                prediction = Math.random() > 0.49 ? "BIG" : "SMALL";
            } else {
                // Mix algorithms for rest of the engines
                let seed = (history && history.length > 0) ? history[0].num + i : i;
                prediction = seed % 2 === 0 ? "BIG" : "SMALL";
            }

            engineResults[engineName] = prediction;
            if (prediction === "SMALL") smallVotes++;
            if (prediction === "BIG") bigVotes++;
        }

        let winningSignal = bigVotes >= smallVotes ? "BIG" : "SMALL";
        let maxVotes = Math.max(bigVotes, smallVotes);

        // Response to Tampermonkey script
        res.json({
            status: "success",
            consensus: {
                totalEngines: 50,
                signal: winningSignal,
                votes: maxVotes
            }
        });

        // Telegram Notification Logic (Har naye period par ek hi baar bhejega)
        if (period !== lastProcessedPeriod) {
            lastProcessedPeriod = period;

            // Win/Loss check pichle round ka
            if (lastSignal && history && history.length > 0) {
                let actual = history[0].size;
                if (lastSignal === actual) totalWins++;
                else totalLosses++;
            }

            let message = `🚨 *${CREATOR_OR_CHANNEL_NAME}* 🚨\n\n` +
                          `📌 *Period:* ${period}\n` +
                          `🔥 *Signal:* ${winningSignal}\n` +
                          `⚙️ *Active Engines:* 50/50 Synchronized\n` +
                          `📊 *Consensus:* ${maxVotes}/50 Engines Agree\n` +
                          `✅ *Total Wins:* ${totalWins}\n` +
                          `❌ *Total Losses:* ${totalLosses}\n` +
                          `⚡ *Status:* Ultimate 50-Engine Power`;

            await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            });

            lastSignal = winningSignal;
        }

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ status: "error", message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`50-Engine Server running on port ${PORT}`);
});
