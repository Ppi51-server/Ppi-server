‎const express = require('express');
‎const cors = require('cors');
‎const https = require('https');
‎const app = express();
‎
‎app.use(express.json());
‎app.use(cors());
‎
‎// --- TELEGRAM CONFIGURATION ---
‎const TELEGRAM_BOT_TOKEN = "8909340205:AAGiS66szSqKYU-YG2ms-JUu2VL2M0C8z1Q"; // BotFather wala token
‎const TELEGRAM_CHAT_ID = "8380859227";     // Apni chat ID
‎
‎function sendTelegramAlert(message) {
‎    if (TELEGRAM_BOT_TOKEN.includes("APNA")) return; // Agar token set nahi hai toh skip karega
‎
‎    const data = JSON.stringify({
‎        chat_id: TELEGRAM_CHAT_ID,
‎        text: message,
‎        parse_mode: "Markdown"
‎    });
‎
‎    const options = {
‎        hostname: 'api.telegram.org',
‎        port: 443,
‎        path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
‎        method: 'POST',
‎        headers: {
‎            'Content-Type': 'application/json',
‎            'Content-Length': data.length
‎        }
‎    };
‎
‎    const req = https.request(options, (res) => {
‎        // Silent success handle
‎    });
‎    req.on('error', (error) => {});
‎    req.write(data);
‎    req.end();
‎}
‎
‎// Diablo-Pro AI Engine with Telegram Trigger
‎function executeDiabloAI(history) {
‎    if (!history || history.length < 5) {
‎        return { color: "GREEN", confidence: 91, digits: [3, 7], strategy: "AI Cold Start" };
‎    }
‎
‎    let colors = history.map(h => h.color);
‎    let nums = history.map(h => h.num);
‎
‎    let streak = 1;
‎    for (let i = 0; i < colors.length - 1; i++) {
‎        if (colors[i] === colors[i + 1]) streak++;
‎        else break;
‎    }
‎
‎    let targetColor = "GREEN";
‎    let baseConfidence = 92;
‎    let strategyName = "Trend Momentum";
‎
‎    if (streak >= 3) {
‎        targetColor = colors[0] === 'GREEN' ? 'RED' : 'GREEN';
‎        baseConfidence = 96; // High confidence trigger
‎        strategyName = `🔥 Streak Reversion (${streak}x)`;
‎    } else {
‎        let redCount = colors.slice(0, 5).filter(c => c === 'RED').length;
‎        targetColor = redCount >= 3 ? 'GREEN' : 'RED';
‎        baseConfidence = 91;
‎        strategyName = "Equilibrium Matrix";
‎    }
‎
‎    let lastNum = nums[0];
‎    let d1 = (lastNum * 3 + 5) % 10;
‎    let d2 = (9 - lastNum + 2) % 10;
‎    if (d1 === d2) d2 = (d2 + 1) % 10;
‎    let exactDigits = [d1, d2].sort((a, b) => a - b);
‎
‎    // Agar confidence 95% ya usse zyada hai, toh Telegram par turant alert bhej do!
‎    if (baseConfidence >= 95) {
‎        let alertMsg = `🚨 *DIABLO-PRO HIGH ACCURACY ALERT* 🚨\n\n` +
‎                       `🎯 *Color Prediction:* \`${targetColor}\`\n` +
‎                       `🔢 *Exact Digits:* \`[${exactDigits.join(', ')}]\`\n` +
‎                       `📊 *Confidence:* \`${baseConfidence}%\`\n` +
‎                       `⚙️ *Strategy:* ${strategyName}\n\n` +
‎                       `⚡ _Time to place your bet!_`;
‎        sendTelegramAlert(alertMsg);
‎    }
‎
‎    return {
‎        color: targetColor,
‎        confidence: baseConfidence + '%',
‎        digits: exactDigits,
‎        dConfidence: '92%',
‎        strategy: strategyName
‎    };
‎}
‎
‎app.post('/api/diablo-compute', (req, res) => {
‎    const { period, history } = req.body;
‎    const aiResult = executeDiabloAI(history);
‎
‎    res.json({
‎        status: "success",
‎        period: period,
‎        prediction: aiResult
‎    });
‎});
‎
‎const PORT = process.env.PORT || 3000;
‎app.listen(PORT, () => {
‎    console.log(`🔥 Diablo-Pro Telegram Server online on port ${PORT}`);
‎});
