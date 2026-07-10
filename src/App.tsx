import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { HeroSection } from './sections/HeroSection';
import { ApiKeySection } from './sections/ApiKeySection';
import { GenerationPanel } from './sections/GenerationPanel';
import { ResultPanel } from './sections/ResultPanel';
import { HistoryPanel } from './sections/HistoryPanel';
import { useRunway } from './hooks/useRunway';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

function App() {
  const [apiKey, setApiKey] = useLocalStorage('runway-api-key', '');
  const { task, loading, error, history, generate, reset, clearHistory } = useRunway();
  const [showError, setShowError] = useState(true);

  const showGenerationPanel = !task || task.status === 'FAILED';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <HeroSection />
      <ApiKeySection apiKey={apiKey} onChange={setApiKey} />

      {error && showError && (
        <div className="max-w-2xl mx-auto px-4 mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setShowError(false)} className="text-red-400 hover:text-red-300 ml-4">x</button>
        </div>
      )}

      {showGenerationPanel && (
        <GenerationPanel apiKey={apiKey} onGenerate={generate} loading={loading} />
      )}

      <ResultPanel task={task} onReset={reset} />
      <HistoryPanel history={history} onClear={clearHistory} />

      <footer className="text-center py-8 text-slate-600 text-sm">
        <p>Kimi x Runway Bridge &middot; Open Source &middot; <a href="https://github.com/playalexey-sketch/kimi-runway-bridge" className="text-purple-500 hover:underline">GitHub</a></p>
      </footer>

      <Toaster />
    </div>
  );
}

export default App;
