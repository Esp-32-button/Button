const express = require('express');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();

// Replace this with the actual IP address of your ESP32
const ESP32_IP = 'http://192.168.251.56';

app.use(bodyParser.json());

// Serve the HTML file
const path = require('path');
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API to control the ESP32 LED
app.post('/control', async (req, res) => {
    const { state } = req.body;

    if (!state) {
        console.error('Invalid request: "state" is missing.');
        return res.status(400).send('Bad Request: "state" is required.');
    }

    console.log(`Request received to set LED state to: ${state}`);

    try {
        // Build the correct URL for ESP32
        const url = `${ESP32_IP}/control?state=${state}`;
        const response = await fetch(url, { method: 'GET' });

        if (!response.ok) {
            throw new Error(`ESP32 responded with status: ${response.status}`);
        }

        const responseText = await response.text();
        console.log(`Response from ESP32: ${responseText}`);
        res.send(responseText);
    } catch (error) {
        console.error('Error communicating with ESP32:', error);
        res.status(500).send('Failed to communicate with ESP32.');
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
