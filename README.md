# Kimi x Runway Bridge

Integration of Kimi with Runway API for AI video generation from text and images. Web interface + REST API for use in agents.

## Features

- **Text to Video** - generate video from text description
- **Image + Text** - use a reference image for generation
- **Settings** - choose model (Gen-4 Turbo / Gen-4), duration, aspect ratio
- **Real-time status** - track generation progress
- **History** - save all generations to localStorage
- **Agent API** - REST endpoints for programmatic use

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/playalexey-sketch/kimi-runway-bridge.git
cd kimi-runway-bridge
npm install
```

### 2. Get API Key

1. Sign up at [dev.runwayml.com](https://dev.runwayml.com)
2. Create an API key in the Dashboard
3. Copy the key

### 3. Run

```bash
# Frontend (5173) + Backend (3001)
npm run dev

# Frontend only
npm run dev:app

# Backend only
npm run dev:api
```

### 4. Production Build

```bash
npm run build
npm run build:api
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| POST | /api/generate | Create generation task |
| GET | /api/tasks/:id | Get task status |
| DELETE | /api/tasks/:id | Cancel task |
| GET | /api/tasks | List tasks |

### Example: Create Task

```bash
curl -X POST http://localhost:3001/api/generate \
  -F "promptText=A cat walking in the park" \
  -F "model=gen4_turbo" \
  -F "duration=5" \
  -F "ratio=1280:768" \
  -F "watermark=false" \
  -F "apiKey=YOUR_RUNWAY_API_KEY"
```

Response:
```json
{
  "taskId": "task_abc123",
  "status": "PENDING"
}
```

### Example: Check Status

```bash
curl "http://localhost:3001/api/tasks/task_abc123?apiKey=YOUR_RUNWAY_API_KEY"
```

## Agent Usage

```javascript
// Create task
const response = await fetch('http://localhost:3001/api/generate', {
  method: 'POST',
  body: formData, // multipart/form-data
});
const { taskId } = await response.json();

// Poll status
const checkStatus = async () => {
  const res = await fetch(`/api/tasks/${taskId}?apiKey=${apiKey}`);
  const data = await res.json();
  return data.status; // PENDING | RUNNING | SUCCEEDED | FAILED
};
```

## Architecture

```
kimi-runway-bridge/
├── api/                    # Express backend
│   ├── server.ts           # Runway API proxy
│   ├── package.json
│   └── tsconfig.json
├── src/
│   ├── sections/           # React sections
│   ├── hooks/              # Custom hooks
│   ├── types/              # TypeScript types
│   └── App.tsx
├── vite.config.ts
└── package.json
```

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Express, TypeScript, Multer, Axios
- **API**: Runway ML REST API

## License

MIT
