import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const publicDir = path.join(__dirname, 'public');

app.disable('x-powered-by');
app.use(compression());
app.use(express.static(publicDir, { maxAge: '1h', extensions: ['html'] }));

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// Fallback to index for root
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Vast PDF running at http://localhost:${port}`);
});