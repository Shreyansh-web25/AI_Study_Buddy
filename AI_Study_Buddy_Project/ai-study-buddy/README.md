# AI Study Buddy ✦

A responsive AI-powered study assistant. Students can ask questions, choose a subject, get explanations, practise MCQs, and create study plans. It uses the Gemini API through a Node.js backend.

## Features
- AI chat powered by Google Gemini
- Subject selector
- Suggested prompts for learning, quizzes and study plans
- Conversation context during the current session
- Responsive desktop and mobile layout
- API key kept on the server (not exposed in browser code)

## Requirements
- Node.js 18 or newer
- A Gemini API key

## Run on Windows

1. Install Node.js from https://nodejs.org/
2. Extract this ZIP and open the `ai-study-buddy` folder in VS Code.
3. Open the VS Code terminal in this folder.
4. Install packages:

   ```bash
   npm install
   ```

5. Copy `.env.example` and rename the copy to `.env`.
6. Open `.env` and add your Gemini API key:

   ```env
   GEMINI_API_KEY=your_key_here
   GEMINI_MODEL=gemini-2.5-flash
   PORT=3000
   ```

7. Start the project:

   ```bash
   npm start
   ```

8. Open http://localhost:3000 in your browser.

## Get a Gemini API key
Create a key in Google AI Studio: https://aistudio.google.com/app/apikey

Keep your key private. Never upload `.env` to GitHub. The `.gitignore` file already excludes it.

## Upload to GitHub
Create a new empty GitHub repository. Upload the project files, but do not upload `.env` or `node_modules`. You can include `.env.example`.

## Project structure

```text
ai-study-buddy/
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## Troubleshooting
- **API key missing:** Confirm the file is named `.env` (not `.env.txt`) and restart the server.
- **Invalid API key:** Create/check your key in Google AI Studio.
- **Model not found:** Set `GEMINI_MODEL` in `.env` to a model available to your API key.
- **Port already in use:** Change `PORT=3000` to another port, such as `3001`.
