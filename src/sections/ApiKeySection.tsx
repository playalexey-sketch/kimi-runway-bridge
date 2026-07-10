import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface Props {
  apiKey: string;
  onChange: (key: string) => void;
}

export function ApiKeySection({ apiKey, onChange }: Props) {
  const [show, setShow] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="max-w-2xl mx-auto px-4 mb-8"
    >
      <Card className="p-6 bg-slate-900/60 border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-slate-200">Runway API Key</h2>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type={show ? 'text' : 'password'}
              value={apiKey}
              onChange={e => onChange(e.target.value)}
              placeholder="Enter your Runway API key..."
              className="bg-slate-950 border-slate-700 text-slate-200 pr-10"
            />
            <button
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Key is stored locally in your browser. Get your key at{' '}
          <a href="https://dev.runwayml.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
            dev.runwayml.com
          </a>
        </p>
      </Card>
    </motion.section>
  );
}
