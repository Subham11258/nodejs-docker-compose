const express = require('express');
const path = require('path');
const fetch = require('node-fetch');


const app = express();
const API_URL = process.env.API_URL || 'http://localhost:3000';


app.use(express.static(path.join(__dirname, 'public')));


// proxy route (optional) to avoid CORS during development when calling backend via container network
app.get('/proxy/items', async (req, res) => {
try {
const resp = await fetch(`${API_URL}/api/items`);
const json = await resp.json();
res.json(json);
} catch (err) {
res.status(500).json({ error: 'proxy error' });
}
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Frontend listening on ${PORT}`));