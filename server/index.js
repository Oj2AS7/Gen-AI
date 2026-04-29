import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { personaPrompts } from './prompts.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

const apiKey = process.env.GOOGLE_API_KEY;
const model = process.env.GOOGLE_MODEL || 'gemini-1.5-flash';

let genAI = null;
if (!apiKey) {
  console.warn('WARNING: GOOGLE_API_KEY is not set. The chat API will fail until the key is configured.');
} else {
  genAI = new GoogleGenerativeAI(apiKey);
}

app.post('/api/chat', async (req, res) => {
  if (!genAI) {
    return res.status(500).json({ error: 'Server is not configured with a Google API key.' });
  }

  const { persona, messages } = req.body;
  if (!persona || !messages) {
    return res.status(400).json({ error: 'Missing persona or messages.' });
  }

  const systemPrompt = personaPrompts[persona];
  if (!systemPrompt) {
    return res.status(400).json({ error: 'Invalid persona selected.' });
  }

  try {
    const geminiModel = genAI.getGenerativeModel({ model, systemInstruction: systemPrompt });
    const userMessage = messages[messages.length - 1]?.content || '';
    const result = await geminiModel.generateContent(userMessage);
    const reply = result.response.text()?.trim();
    if (!reply) {
      throw new Error('Empty response from the AI.');
    }
    res.json({ reply });
  } catch (error) {
    console.error('Gemini error:', error?.message || error);
    res.status(500).json({ error: 'Failed to fetch response from the AI service. Please try again later.' });
  }
});

app.get('/healthz', (_req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
