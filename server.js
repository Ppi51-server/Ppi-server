app.get('/get-data', (req, res) => {
    res.json({
        round: "20260917001",
        prediction: "Green",
        time: new Date().toLocaleTimeString()
    });
});
