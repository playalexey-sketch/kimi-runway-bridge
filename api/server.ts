import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const PORT = process.env.PORT || 3001;
const RUNWAY_API_URL = 'https://api.runwayml.com/v1';

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Generate video
app.post('/api/generate', upload.single('promptImage'), async (req, res) => {
  try {
    const { promptText, model, duration, ratio, watermark, apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }
    if (!promptText) {
      return res.status(400).json({ error: 'Prompt text is required' });
    }

    const input: any = {
      promptText,
      model: model || 'gen4_turbo',
      duration: parseInt(duration) || 5,
      ratio: ratio || '1280:768',
      watermark: watermark === 'true' || watermark === true,
    };

    if (req.file) {
      const base64 = req.file.buffer.toString('base64');
      const mimeType = req.file.mimetype || 'image/png';
      input.promptImage = `data:${mimeType};base64,${base64}`;
    }

    const response = await axios.post(
      `${RUNWAY_API_URL}/tasks`,
      {
        taskType: 'falcon_video_generation_task',
        input,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    res.json({
      taskId: response.data.id,
      status: response.data.status,
      createdAt: response.data.createdAt,
    });
  } catch (error: any) {
    console.error('Generate error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || error.message || 'Internal server error',
    });
  }
});

// Get task status
app.get('/api/tasks/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { apiKey } = req.query;

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    const response = await axios.get(`${RUNWAY_API_URL}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      timeout: 15000,
    });

    res.json(response.data);
  } catch (error: any) {
    console.error('Status error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || error.message || 'Internal server error',
    });
  }
});

// Cancel task
app.delete('/api/tasks/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { apiKey } = req.query;

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    const response = await axios.delete(`${RUNWAY_API_URL}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      timeout: 15000,
    });

    res.json(response.data);
  } catch (error: any) {
    console.error('Cancel error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || error.message || 'Internal server error',
    });
  }
});

// List tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const { apiKey } = req.query;
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }
    const response = await axios.get(`${RUNWAY_API_URL}/tasks`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      timeout: 15000,
    });
    res.json(response.data);
  } catch (error: any) {
    console.error('List error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || error.message || 'Internal server error',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Runway API proxy running on port ${PORT}`);
});
