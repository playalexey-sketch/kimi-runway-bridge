import { motion } from 'framer-motion';
import { Clock, Trash2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { HistoryItem } from '@/types/runway';

interface Props {
  history: HistoryItem[];
  onClear: () => void;
}

export function HistoryPanel({ history, onClear }: Props) {
  if (history.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="max-w-2xl mx-auto px-4 mb-8"
    >
      <Card className="p-6 bg-slate-900/60 border-slate-800 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-slate-200">History ({history.length})</h2>
          </div>
          <Button onClick={onClear} variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {history.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 flex items-center gap-3"
            >
              {item.status === 'SUCCEEDED' ? (
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300 truncate">{item.promptText}</p>
                <p className="text-xs text-slate-500">
                  {item.model} &middot; {item.ratio} &middot; {item.duration}s &middot; {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
              {item.videoUrl && (
                <a
                  href={item.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-purple-400 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.section>
  );
}
