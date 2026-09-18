const express = require('express');
const { WebSocketServer } = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// HTTP Server port
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// WebSocket Server setup (same port par chalega)
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('New client connected to live sync!');

    // Jab client se koi data aaye
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);

        // Sabhi connected clients ko data broadcast (sync) karein
        wss.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Optional HTTP endpoint status check ke liye
app.get('/', (req, res) => {
    res.send('Live Sync Backend is Running!');
});
