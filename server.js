// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // untuk dev; batasi origin di production
app.use(express.json({ limit: '1mb' }));

const GG_KEY = process.env.GG_API_KEY;
if (!GG_KEY) {
  console.warn('Warning: GG_API_KEY not set in environment. Set it in .env');
}

app.post('/api/generate', async (req, res) => {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GG_KEY}`;
    const response = await axios.post(url, req.body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 60000
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { message: err.message };
    console.error('[Proxy] Error calling Google API:', status, data);
    res.status(status).json({ error: data });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy listening on http://localhost:${PORT}`);
});
