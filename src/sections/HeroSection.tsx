import { motion } from 'framer-motion';
import { Film, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-slate-950 to-violet-950/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-700 shadow-lg shadow-purple-500/25">
            <Film className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-300 via-violet-300 to-purple-400 bg-clip-text text-transparent mb-4"
        >
          Kimi x Runway Bridge
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-slate-400 max-w-2xl mx-auto flex items-center justify-center gap-2 flex-wrap"
        >
          <Sparkles className="w-5 h-5 text-purple-400" />
          AI Video Generation from Text and Images via Runway API
          <Sparkles className="w-5 h-5 text-purple-400" />
        </motion.p>
      </div>
    </section>
  );
}
