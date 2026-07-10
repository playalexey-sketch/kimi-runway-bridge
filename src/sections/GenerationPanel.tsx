import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Wand2, ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { type GenerationParams, type RunwayModel, type RunwayDuration, type RunwayRatio } from '@/types/runway';

interface Props {
  apiKey: string;
  onGenerate: (params: GenerationParams) => void;
  loading: boolean;
}

export function GenerationPanel({ apiKey, onGenerate, loading }: Props) {
  const [promptText, setPromptText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [model, setModel] = useState<RunwayModel>('gen4_turbo');
  const [duration, setDuration] = useState<RunwayDuration>(5);
  const [ratio, setRatio] = useState<RunwayRatio>('1280:768');
  const [watermark, setWatermark] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = e => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  }, [handleImageSelect]);

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = () => {
    if (!promptText.trim() || !apiKey) return;
    onGenerate({
      promptText: promptText.trim(),
      promptImage: image,
      model,
      duration,
      ratio,
      watermark,
      apiKey,
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="max-w-2xl mx-auto px-4 mb-8"
    >
      <Card className="p-6 bg-slate-900/60 border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-6">
          <Wand2 className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-slate-200">Video Generation</h2>
        </div>

        <div className="mb-4">
          <Label className="text-slate-400 mb-2 block">Video description (prompt)</Label>
          <Textarea
            value={promptText}
            onChange={e => setPromptText(e.target.value)}
            placeholder="Describe the video you want to create..."
            rows={4}
            className="bg-slate-950 border-slate-700 text-slate-200 resize-none"
          />
        </div>

        <div className="mb-4">
          <Label className="text-slate-400 mb-2 block">Reference image (optional)</Label>
          {imagePreview ? (
            <div className="relative inline-block">
              <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg border border-slate-700" />
              <button
                onClick={clearImage}
                className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500/50 hover:bg-slate-800/50 transition-colors"
            >
              <ImagePlus className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Drag image here or click to select</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={e => e.target.files?.[0] && handleImageSelect(e.target.files[0])}
                className="hidden"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <Label className="text-slate-400 mb-2 block">Model</Label>
            <Select value={model} onValueChange={v => setModel(v as RunwayModel)}>
              <SelectTrigger className="bg-slate-950 border-slate-700 text-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="gen4_turbo">Gen-4 Turbo</SelectItem>
                <SelectItem value="gen4">Gen-4</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-400 mb-2 block">Duration</Label>
            <Select value={String(duration)} onValueChange={v => setDuration(Number(v) as RunwayDuration)}>
              <SelectTrigger className="bg-slate-950 border-slate-700 text-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="5">5 seconds</SelectItem>
                <SelectItem value="10">10 seconds</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-400 mb-2 block">Aspect Ratio</Label>
            <Select value={ratio} onValueChange={v => setRatio(v as RunwayRatio)}>
              <SelectTrigger className="bg-slate-950 border-slate-700 text-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="1280:768">16:9 Landscape</SelectItem>
                <SelectItem value="768:1280">9:16 Portrait</SelectItem>
                <SelectItem value="1280:1280">1:1 Square</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Switch id="watermark" checked={watermark} onCheckedChange={setWatermark} />
            <Label htmlFor="watermark" className="text-slate-400 cursor-pointer">Watermark</Label>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!promptText.trim() || !apiKey || loading}
            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white px-8"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Wand2 className="w-4 h-4" />
                Generate
              </span>
            )}
          </Button>
        </div>
      </Card>
    </motion.section>
  );
}
