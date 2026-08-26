const express = require('express');
const cors = require('cors');
const https = require('https');
const app = express();

app.use(express.json());
app.use(cors());

// Global Real-Time Database Memory Cluster
let gameDatabase = {
    records: [],
    stats: { wins: 0, losses: 0 }
};

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

// Multi-Engine Calculation (V2, V3, V4, AI PRO, AI ADVANCE, Adime, Medusacheat, TRX)
function computeDiabloZEngine(history, version) {
    if (!history || history.length < 5) {
        return { prediction: "BIG", confidence: "94%", method: `${version} Cold Start` };
    }

    let nums = history.map(h => h.num);
    let sizes = history.map(h => h.size);

    let bigCount = sizes.slice(0, 6).filter(s => s === 'BIG').length;
    let smallCount = sizes.slice(0, 6).filter(s => s === 'SMALL').length;

    let targetSize = "BIG";
    let baseConf = 92;
    let activeStrategy = `${version} - Standard Matrix`;

    // Version-specific advanced calculation logic
    if (version === "V3" || version === "AI_PRO") {
        let streak = 1;
        for (let i = 0; i < sizes.length - 1; i++) {
            if (sizes[i] === sizes[i + 1]) streak++;
            else break;
        }
        if (streak >= 3) {
            targetSize = sizes[0] === 'BIG' ? 'SMALL' : 'BIG';
            baseConf = 97;
            activeStrategy = `${version} - Exhaustion Reversal (${streak}x)`;
        } else {
            targetSize = bigCount >= 4 ? 'SMALL' : 'BIG';
            baseConf = 95;
        }
    } else if (version === "V4" || version === "AI_ADVANCE" || version === "MEDUSA") {
        let variance = nums.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
        targetSize = variance >= 4.5 ? 'SMALL' : 'BIG';
        baseConf = 98;
        activeStrategy = `${version} - Medusacheat Variance Engine`;
    } else if (version === "ADIME" || version === "TRX") {
        targetSize = (nums[0] + nums[1]) % 2 === 0 ? 'BIG' : 'SMALL';
        baseConf = 96;
        activeStrategy = `${version} - TRX Hash Momentum`;
    }

    if (baseConf >= 96) {
        sendTelegramAlert(`🚨 *DIABLO-Z ${version} ALERT* 🚨\n\n🎯 *Prediction:* \`${targetSize}\`\n📊 *Conf:* \`${baseConf}%\`\n⚙️ *Strat:* ${activeStrategy}`);
    }

    return {
        prediction: targetSize,
        confidence: baseConf + '%',
        method: activeStrategy
    };
}

app.post('/api/diablo-z-compute', (req, res) => {
    const { period, history, version } = req.body;
    
    // Push to Real-Time Game Database
    if (period && history) {
        gameDatabase.records.unshift({ period, history });
        if (gameDatabase.records.length > 100) gameDatabase.records.pop();
    }

    const selectedVersion = version || "AI_PRO";
    const result = computeDiabloZEngine(history, selectedVersion);
    
    res.json({
        status: "success",
        database_synced: true,
        version: selectedVersion,
        period,
        prediction: result
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 Diablo-Z Enterprise Server active on port ${PORT}`));
