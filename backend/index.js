const express = require('express');
const cors = require('cors');
const db = require('./db');


const app = express();
app.use(express.json());
app.use(cors());


app.get('/health', (req, res) => res.json({ status: 'ok' }));


app.get('/api/items', async (req, res) => {
try {
const result = await db.query('SELECT id, name, created_at FROM items ORDER BY id');
res.json(result.rows);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Database error' });
}
});


app.post('/api/items', async (req, res) => {
const { name } = req.body;
if (!name) return res.status(400).json({ error: 'name required' });
try {
const result = await db.query('INSERT INTO items (name) VALUES ($1) RETURNING id, name, created_at', [name]);
res.status(201).json(result.rows[0]);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Database error' });
}
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));