import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Download, RotateCcw, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { GenerationTask } from '@/types/runway';

interface Props {
  task: GenerationTask | null;
  onReset: () => void;
}

export function ResultPanel({ task, onReset }: Props) {
  if (!task) return null;

  const getProgress = () => {
    switch (task.status) {
      case 'PENDING': return 10;
      case 'RUNNING': return 50;
      case 'SUCCEEDED': return 100;
      case 'FAILED': return 100;
      default: return 0;
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'SUCCEEDED': return 'text-green-400';
      case 'FAILED': return 'text-red-400';
      case 'RUNNING': return 'text-blue-400';
      default: return 'text-yellow-400';
    }
  };

  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="max-w-2xl mx-auto px-4 mb-8"
      >
        <Card className="p-6 bg-slate-900/60 border-slate-800 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Video className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-slate-200">Result</h2>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${getStatusColor()}`}>
                {task.status === 'PENDING' && <span className="flex items-center gap-1"><Loader2 className="w-4 h-4 animate-spin" /> Pending...</span>}
                {task.status === 'RUNNING' && <span className="flex items-center gap-1"><Loader2 className="w-4 h-4 animate-spin" /> Generating...</span>}
                {task.status === 'SUCCEEDED' && <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Done!</span>}
                {task.status === 'FAILED' && <span className="flex items-center gap-1"><XCircle className="w-4 h-4" /> Error</span>}
              </span>
              <span className="text-xs text-slate-500">ID: {task.id.slice(0, 8)}...</span>
            </div>
            <Progress value={getProgress()} className="h-2" />
          </div>

          {task.error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
              {task.error}
            </div>
          )}

          {task.status === 'SUCCEEDED' && task.output?.video && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <video
                src={task.output.video}
                controls
                autoPlay
                loop
                className="w-full rounded-lg border border-slate-700"
              />
              <div className="flex gap-2">
                <Button asChild className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500">
                  <a href={task.output.video} download target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Video
                  </a>
                </Button>
                <Button onClick={onReset} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  <RotateCcw className="w-4 h-4 mr-1" />
                  New
                </Button>
              </div>
            </motion.div>
          )}

          {task.status === 'FAILED' && (
            <Button onClick={onReset} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              <RotateCcw className="w-4 h-4 mr-1" />
              Try Again
            </Button>
          )}
        </Card>
      </motion.section>
    </AnimatePresence>
  );
}
