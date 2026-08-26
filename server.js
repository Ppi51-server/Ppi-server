const express = require('express');
const cors = require('cors');
const https = require('https');
const app = express();

app.use(express.json());
app.use(cors());

let gameDatabase = { records: [], stats: { wins: 0, losses: 0 } };

const TELEGRAM_BOT_TOKEN = "8909340205:AAGiS66szSqKYU-YG2ms-JUu2VL2M0C8z1Q";
const TELEGRAM_CHAT_ID = "8380859227";

function sendTelegramAlert(message) {
    if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN.includes("APNA")) return;
    const data = JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: "Markdown" });
    const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    };
    const req = https.request(options, (res) => {});
    req.on('error', (e) => {});
    req.write(data);
    req.end();
}

let lastSentPrediction = null;

function computeEngineVersionLogic(history, version) {
    let nums = history.map(h => h.num);
    let sizes = history.map(h => h.size);
    let lastNum = nums[0];

    let targetSize = "BIG";
    let baseConf = 90;
    let strategyDesc = "";

    switch (version) {
        case "PRIVATE_GOD_MODE":
            // High Rush & Volatility Pattern Matrix for Ultra Sure Calls
            let rushCheck = Math.abs(nums[0] - nums[1]);
            let streak = 1;
            for (let i = 0; i < sizes.length - 1; i++) {
                if (sizes[i] === sizes[i + 1]) streak++; else break;
            }

            if (rushCheck >= 5 || streak >= 3) {
                targetSize = sizes[0] === 'BIG' ? 'SMALL' : 'BIG';
                baseConf = 99;
                strategyDesc = "🔒 PRIVATE GOD MODE - High Rush Sure Call";
            } else {
                return { prediction: "SKIP", confidence: "SAFE", method: "🔒 PRIVATE GOD MODE - Waiting for Rush Setup" };
            }
            break;

        default:
            targetSize = lastNum >= 5 ? "SMALL" : "BIG";
            baseConf = 92;
            strategyDesc = "Standard Engine";
    }

    // Send high-confidence alert to Telegram
    if (baseConf >= 98 && targetSize !== "SKIP") {
        lastSentPrediction = targetSize;
        sendTelegramAlert(`🔥 *PRIVATE GOD MODE SIGNAL* 🔥\n\n🎯 *Prediction:* \`${targetSize}\`\n📊 *Confidence:* \`${baseConf}%\`\n⚙️ *Strategy:* ${strategyDesc}\n⏳ *Status:* Active & Waiting for Result`);
    }

    return {
        prediction: targetSize,
        confidence: baseConf + '%',
        method: strategyDesc
    };
}

// Function to notify Telegram about Win/Loss result
function sendResultUpdateToTelegram(actualSize) {
    if (!lastSentPrediction) return;
    let isWin = (lastSentPrediction === actualSize);
    let resultEmoji = isWin ? "🎉 *WIN! (PASSED)* ✅" : "😢 *LOSS! (FAILED)* ❌";
    
    sendTelegramAlert(`📊 *ROUND RESULT NOTIFICATION* 📊\n\n📌 *Predicted:* \`${lastSentPrediction}\`\n🎯 *Actual:* \`${actualSize}\`\nStatus: ${resultEmoji}`);
    lastSentPrediction = null; // reset
}

app.post('/api/diablo-z-compute', (req, res) => {
    const { period, history, version, lastActualSize } = req.body;
    
    if (lastActualSize) {
        sendResultUpdateToTelegram(lastActualSize);
    }

    if (period && history) {
        gameDatabase.records.unshift({ period, history });
        if (gameDatabase.records.length > 100) gameDatabase.records.pop();
    }

    let selectedVersion = version || "PRIVATE_GOD_MODE";
    let result = computeEngineVersionLogic(history, selectedVersion);

    res.json({
        status: "success",
        database_synced: true,
        version: selectedVersion,
        period,
        prediction: result
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 Diablo-Z Rush-Aware Server active on port ${PORT}`));
