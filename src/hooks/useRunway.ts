import { useState, useRef, useCallback } from 'react';
import type { GenerationParams, GenerationTask, HistoryItem } from '@/types/runway';
import { useLocalStorage } from './useLocalStorage';

const API_BASE = '/api';

export function useRunway() {
  const [task, setTask] = useState<GenerationTask | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('runway-history', []);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearPoll = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const addToHistory = useCallback((item: HistoryItem) => {
    setHistory(prev => [item, ...prev].slice(0, 50));
  }, [setHistory]);

  const generate = useCallback(async (params: GenerationParams) => {
    clearPoll();
    setLoading(true);
    setError(null);
    setTask(null);

    try {
      const formData = new FormData();
      formData.append('promptText', params.promptText);
      formData.append('model', params.model);
      formData.append('duration', String(params.duration));
      formData.append('ratio', params.ratio);
      formData.append('watermark', String(params.watermark));
      formData.append('apiKey', params.apiKey);
      if (params.promptImage) {
        formData.append('promptImage', params.promptImage);
      }

      const res = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to start generation');
      }

      const data = await res.json();
      setTask({
        id: data.taskId,
        status: 'PENDING',
        createdAt: data.createdAt,
      });

      pollRef.current = setInterval(async () => {
        try {
          const statusRes = await fetch(
            `${API_BASE}/tasks/${data.taskId}?apiKey=${encodeURIComponent(params.apiKey)}`
          );
          if (!statusRes.ok) return;
          const statusData = await statusRes.json();

          const taskData: GenerationTask = {
            id: statusData.id,
            status: statusData.status,
            output: statusData.output,
            error: statusData.error,
            createdAt: statusData.createdAt,
          };

          setTask(taskData);

          if (['SUCCEEDED', 'FAILED', 'CANCELLED'].includes(statusData.status)) {
            clearPoll();
            setLoading(false);

            if (statusData.status === 'SUCCEEDED' && statusData.output?.video) {
              addToHistory({
                id: statusData.id,
                promptText: params.promptText,
                status: statusData.status,
                videoUrl: statusData.output.video,
                createdAt: statusData.createdAt,
                model: params.model,
                ratio: params.ratio,
                duration: params.duration,
              });
            }
          }
        } catch {
          // Silently retry
        }
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      setLoading(false);
    }
  }, [clearPoll, addToHistory]);

  const cancel = useCallback(async (taskId: string, apiKey: string) => {
    try {
      await fetch(`${API_BASE}/tasks/${taskId}?apiKey=${encodeURIComponent(apiKey)}`, {
        method: 'DELETE',
      });
      clearPoll();
      setLoading(false);
    } catch {
      // Ignore
    }
  }, [clearPoll]);

  const reset = useCallback(() => {
    clearPoll();
    setTask(null);
    setError(null);
    setLoading(false);
  }, [clearPoll]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  return { task, loading, error, history, generate, cancel, reset, clearHistory };
}
