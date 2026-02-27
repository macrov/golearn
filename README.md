# Golearn - Interactive Go Learning Platform

An interactive web platform for learning Go programming.

## Features

- 🎯 Interactive tutorials (left: lesson, right: code)
- 🖥️ In-browser Go execution (WASM)
- 📚 Course/lesson system
- 📊 Progress tracking
- 💡 Hints and answers

## Tech Stack

- **Frontend**: React + TypeScript
- **Backend**: Go
- **Database**: SQLite
- **Code Execution**: Go WASM (browser-based)

## Project Structure

```
golearn/
├── backend/          # Go API server
├── frontend/         # React web app
└── README.md
```

## Development

### Prerequisites
- Node.js 18+
- Go 1.21+

### Setup

```bash
# Install frontend dependencies
cd frontend
npm install

# (Backend has no external dependencies)
```

### Run

```bash
# Start both frontend and backend (from project root)
npm run dev:full

# Or start separately:
npm run dev      # Frontend only (localhost:5173)
npm run server   # Backend only (localhost:8080)
```

The frontend proxies `/api` requests to the backend at `localhost:8080`.

## License

MIT
