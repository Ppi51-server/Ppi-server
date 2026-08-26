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
    let targetSize = "BIG";
    let baseConf = 90;
    let strategyDesc = "";

    if (version === "PRIVATE_GOD_MODE") {
        // High Betting Rush & Volatility Matrix for Heavy Bets
        let rushDiff = Math.abs(nums[0] - nums[1]);
        let streak = 1;
        for (let i = 0; i < sizes.length - 1; i++) {
            if (sizes[i] === sizes[i + 1]) streak++; else break;
        }

        if (rushDiff >= 4 || streak >= 3) {
            targetSize = sizes[0] === 'BIG' ? 'SMALL' : 'BIG';
            baseConf = 99;
            strategyDesc = "🔒 PRIVATE GOD MODE (Heavy Rush Call)";
        } else {
            return { prediction: "SKIP", confidence: "SAFE", method: "🔒 PRIVATE GOD MODE - Waiting for Rush" };
        }
    } else if (version === "AI_PRO") {
        // Original Diablo Script Flow
        let streak = 1;
        for (let i = 0; i < sizes.length - 1; i++) {
            if (sizes[i] === sizes[i + 1]) streak++; else break;
        }
        if (streak >= 3) {
            targetSize = sizes[0] === 'BIG' ? 'SMALL' : 'BIG';
            baseConf = 95;
            strategyDesc = "🔥 AI PRO - Diablo Original Reversal";
        } else {
            let bigCount = sizes.slice(0, 4).filter(s => s === 'BIG').length;
            targetSize = bigCount >= 2 ? 'SMALL' : 'BIG';
            baseConf = 92;
            strategyDesc = "⚡ AI PRO - Diablo Trend Flow";
        }
    }

    if (baseConf >= 95 && targetSize !== "SKIP") {
        lastSentPrediction = targetSize;
        sendTelegramAlert(`🚨 *DIABLO-Z ${version} ALERT* 🚨\n\n🎯 *Prediction:* \`${targetSize}\`\n📊 *Conf:* \`${baseConf}%\`\n⚙️ *Strat:* ${strategyDesc}`);
    }

    return {
        prediction: targetSize,
        confidence: baseConf + '%',
        method: strategyDesc
    };
}

function sendResultUpdateToTelegram(actualSize) {
    if (!lastSentPrediction) return;
    let isWin = (lastSentPrediction === actualSize);
    let resultEmoji = isWin ? "🎉 *WIN! (PASSED)* ✅" : "😢 *LOSS! (FAILED)* ❌";
    sendTelegramAlert(`📊 *RESULT NOTIFICATION* 📊\n\n📌 *Predicted:* \`${lastSentPrediction}\`\n🎯 *Actual:* \`${actualSize}\`\nStatus: ${resultEmoji}`);
    lastSentPrediction = null;
}

app.post('/api/diablo-z-compute', (req, res) => {
    const { period, history, version, lastActualSize } = req.body;
    if (lastActualSize) sendResultUpdateToTelegram(lastActualSize);

    let selectedVersion = version || "PRIVATE_GOD_MODE";
    let result = computeEngineVersionLogic(history, selectedVersion);

    res.json({ status: "success", version: selectedVersion, period, prediction: result });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 Diablo-Z Server active on port ${PORT}`));
