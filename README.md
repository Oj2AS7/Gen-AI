# Persona-Based AI Chatbot

A small project built for the Scaler Academy assignment: a persona-based chatbot that lets users talk with three Scaler/InterviewBit mentor personalities.

## Features

- Persona switcher for Anshuman Singh, Abhimanyu Saxena, and Kshitij Mishra
- Each persona has its own distinct system prompt and few-shot examples
- Conversation resets on persona switch
- Suggestion chips for quick-start questions
- Typing indicator while the AI generates a reply
- Responsive UI for desktop and mobile
- Backend securely reads the OpenAI API key from `.env`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the example environment file:

```bash
cp .env.example .env
```

3. Add your OpenAI API key to `.env`:

```text
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the app:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## Build and Production

```bash
npm run build
npm run start
```

The server runs on port `5000` by default, and Vite proxies API requests during development.

## Files to Review

- `server/prompts.js` - persona system prompts used by the backend
- `prompts.md` - annotated prompt document for the assignment
- `reflection.md` - 300+ word reflection on what worked and what to improve
- `.env.example` - example environment file without any secret values

## Deployment

This app can be deployed to any platform that supports Node.js, such as Vercel, Railway, or Render. Make sure to add `OPENAI_API_KEY` in the deployment environment variables.

## Notes

- No API key is stored in the repository.
- The app handles API errors gracefully and displays a friendly message if the OpenAI request fails.
