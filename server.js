const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Multi-Pattern Smart Engine for Big/Small
function analyzePatterns(history) {
    if (!history || history.length < 3) {
        return { prediction: "Big", patternName: "Smart Engine" };
    }

    let recentSizes = history.map(h => h.size || h.bs);
    
    // Trend reversal logic for better Big/Small accuracy
    let countBig = recentSizes.slice(0, 5).filter(s => s === 'Big').length;
    
    let prediction = countBig >= 3 ? "Small" : "Big";
    let patternName = countBig >= 3 ? "Reversal Counter" : "Momentum Follow";

    // Alternating check
    if (recentSizes[0] !== recentSizes[1] && recentSizes[1] !== recentSizes[2]) {
        prediction = recentSizes[0] === 'Big' ? 'Small' : 'Big';
        patternName = "Alternating Matrix";
    }

    return { 
        prediction: prediction, 
        patternName: patternName 
    };
}

app.post('/api/get-pattern', (req, res) => {
    const { period, history } = req.body;
    const result = analyzePatterns(history);

    res.json({
        period: period,
        prediction: result.prediction,
        patternName: result.patternName,
        status: "success"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
