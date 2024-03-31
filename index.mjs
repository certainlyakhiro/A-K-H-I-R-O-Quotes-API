import fs from "fs";
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const apiKeys = ["AkhiroAPI"];

const fileData = JSON.parse(fs.readFileSync(path.join(__dirname, "quotes.json"), "utf8"));

function needApiKey(req, res, next) {
  if (req.path.startsWith('/randomQuote')) {
    const apiKey = req.query.key;
    if (!apiKeys.includes(apiKey)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }
  next();
}

app.use(express.static(path.join(__dirname, 'QuotesDB', 'public')));
app.use(needApiKey);

app.get('/randomQuote', needApiKey, (req, res) => {
  const apiKey = req.query.key;
  if (!apiKeys.includes(apiKey)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const randomQuote = fileData[Math.floor(Math.random() * fileData.length)];
  const { quote, author, category } = randomQuote;
  const responseData = { data: { quote, author, category } };
  res.json(responseData);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'QuotesDB', 'public', 'system.html'));
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});