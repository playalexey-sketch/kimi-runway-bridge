export type RunwayModel = 'gen4_turbo' | 'gen4';
export type RunwayDuration = 5 | 10;
export type RunwayRatio = '1280:768' | '768:1280' | '1280:1280';

export interface GenerationParams {
  promptText: string;
  promptImage?: File | null;
  model: RunwayModel;
  duration: RunwayDuration;
  ratio: RunwayRatio;
  watermark: boolean;
  apiKey: string;
}

export interface GenerationTask {
  id: string;
  status: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED';
  output?: {
    video?: string;
    images?: string[];
  };
  error?: string;
  createdAt: string;
}

export interface HistoryItem {
  id: string;
  promptText: string;
  status: string;
  videoUrl?: string;
  createdAt: string;
  model: string;
  ratio: string;
  duration: number;
}
