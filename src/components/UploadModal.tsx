import React, { useState, useRef } from 'react';
import { useTouTube } from '../context/TouTubeContext';
import { Video } from '../types';
import {
  Upload,
  X,
  ShieldCheck,
  CheckCircle2,
  Video as VideoIcon,
  Flame,
  FileVideo,
  Image as ImageIcon,
  Sparkles,
  Info
} from 'lucide-react';

export const UploadModal: React.FC = () => {
  const { isUploadModalOpen, setIsUploadModalOpen, addNewVideo, currentUser, setActiveTab } = useTouTube();

  const [videoType, setVideoType] = useState<'video' | 'short'>('video');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'music' | 'tech' | 'nature' | 'food' | 'sports' | 'lifestyle' | 'vlogs' | 'gaming'>('vlogs');
  const [tagsInput, setTagsInput] = useState('humanmade, authentic, raw');
  const [gearNote, setGearNote] = useState('');
  const [isHumanCertified, setIsHumanCertified] = useState(true);

  // Video file or URL
  const [videoFileUrl, setVideoFileUrl] = useState<string>('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const thumbInputRef = useRef<HTMLInputElement | null>(null);

  // Preset royalty-free authentic raw footage for 1-click test
  const PRESET_SAMPLES = [
    {
      label: 'Skateboard Trick (Raw)',
      type: 'short',
      url: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
      thumb: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&w=800&q=80',
      title: 'Real Street Skate Session - Kickflip to Manual',
      cat: 'sports'
    },
    {
      label: 'Acoustic Guitar Riff',
      type: 'video',
      url: 'https://vjs.zencdn.net/v/oceans.mp4',
      thumb: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
      title: 'Midnight Fingerstyle Improvisation on Cedar Guitar',
      cat: 'music'
    },
    {
      label: 'Rainy Cafe Ambience',
      type: 'video',
      url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      thumb: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      title: 'Brewing Coffee in Rain - Pure Natural Audio',
      cat: 'lifestyle'
    }
  ];

  if (!isUploadModalOpen) return null;

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoFileUrl(url);
      setFileName(file.name);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
      if (!thumbnailUrl) {
        // default nice placeholder thumbnail until user uploads or picks
        setThumbnailUrl('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80');
      }
    }
  };

  const handleThumbFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailUrl(URL.createObjectURL(file));
    }
  };

  const handleApplyPreset = (sample: typeof PRESET_SAMPLES[0]) => {
    setVideoFileUrl(sample.url);
    setThumbnailUrl(sample.thumb);
    setTitle(sample.title);
    setVideoType(sample.type as any);
    setCategory(sample.cat as any);
    setFileName(sample.label);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFileUrl) {
      alert('Please upload a video file or pick a sample!');
      return;
    }
    if (!isHumanCertified) {
      alert('TouTube requires videos to be certified as human-created!');
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    const timer1 = setTimeout(() => setUploadProgress(65), 300);
    const timer2 = setTimeout(() => setUploadProgress(100), 700);

    const timer3 = setTimeout(() => {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      addNewVideo({
        title: title || 'Untitled Human Video',
        description: description || 'Authentic human-created content uploaded to TouTube.',
        videoUrl: videoFileUrl,
        thumbnailUrl:
          thumbnailUrl ||
          'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
        duration: videoType === 'short' ? 15 : 45,
        category,
        type: videoType,
        isHumanVerified: true,
        humanVerificationNote: gearNote || 'Human recorded and edited video with verified authenticity',
        tags: tags.length ? tags : ['HumanMade', 'TouTube', 'Original'],
        creator: {
          id: currentUser.id,
          name: currentUser.name,
          handle: currentUser.handle,
          avatar: currentUser.avatar,
          subscribers: currentUser.subscribers,
          isVerified: true,
          isSubscribed: false
        }
      });

      setIsUploading(false);
      setIsUploadModalOpen(false);
      if (videoType === 'short') {
        setActiveTab('shorts');
      } else {
        setActiveTab('home');
      }

      // Reset
      setTitle('');
      setDescription('');
      setVideoFileUrl('');
      setThumbnailUrl('');
      setFileName('');
      setUploadProgress(0);
    }, 900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-5 sm:p-7 space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-600/10 text-rose-600 dark:text-rose-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-zinc-900 dark:text-white">
                Post Authentic Video or Short
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                TouTube only accepts 100% human-created footage (No AI models)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(false)}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Format Selector: Standard Video vs Short Reel */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setVideoType('video')}
              className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                videoType === 'video'
                  ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-bold shadow-xs'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <VideoIcon className="w-5 h-5" />
              <div>
                <div className="text-xs font-bold">Standard Video</div>
                <div className="text-[11px] text-zinc-500 font-normal">16:9 Landscape Video</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setVideoType('short')}
              className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                videoType === 'short'
                  ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-bold shadow-xs'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <Flame className="w-5 h-5" />
              <div>
                <div className="text-xs font-bold">TouTube Short</div>
                <div className="text-[11px] text-zinc-500 font-normal">9:16 Vertical Reel</div>
              </div>
            </button>
          </div>

          {/* Video File Upload Area */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
              <span>Video File (MP4, WebM, MOV)</span>
              {fileName && <span className="text-emerald-500 font-normal truncate max-w-xs">{fileName}</span>}
            </label>

            <input
              type="file"
              ref={fileInputRef}
              accept="video/*"
              onChange={handleVideoFileChange}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-4 text-center cursor-pointer hover:border-rose-500 dark:hover:border-rose-500 transition-colors bg-zinc-50/50 dark:bg-zinc-950/40"
            >
              <FileVideo className="w-8 h-8 text-rose-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                Click to browse video file from device or drag & drop
              </p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Up to 4K resolution supported. Real camera output preferred.
              </p>
            </div>

            {/* Quick Sample Presets for rapid test */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-[11px] text-zinc-400">Or use authentic sample:</span>
              {PRESET_SAMPLES.map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() => handleApplyPreset(sample)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Video Preview if selected */}
          {videoFileUrl && (
            <div className="relative aspect-video max-h-48 rounded-xl overflow-hidden bg-black mx-auto">
              <video key={videoFileUrl} controls preload="metadata" className="w-full h-full object-contain">
                <source src={videoFileUrl} type="video/mp4" />
                Your browser does not support HTML5 video preview.
              </video>
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your authentic video a catchy title..."
                required
                className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-rose-500"
              >
                <option value="vlogs">Vlogs</option>
                <option value="music">Music</option>
                <option value="tech">Tech</option>
                <option value="sports">Sports</option>
                <option value="food">Food & Cooking</option>
                <option value="nature">Nature</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="gaming">Gaming</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers how this video was shot, locations, or notes..."
              rows={2}
              className="w-full p-2.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Camera / Gear verification note & tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                Camera / Gear Used (Optional)
              </label>
              <input
                type="text"
                value={gearNote}
                onChange={(e) => setGearNote(e.target.value)}
                placeholder="e.g. Sony FX3 + 24-70mm GM II lens"
                className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="human, raw, vlog, guitar"
                className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Human Non-AI Declaration (Mandatory) */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3">
            <input
              type="checkbox"
              id="human-cert"
              checked={isHumanCertified}
              onChange={(e) => setIsHumanCertified(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
            />
            <label htmlFor="human-cert" className="text-xs text-emerald-900 dark:text-emerald-300 leading-relaxed cursor-pointer">
              <span className="font-bold">Human Authenticity Certification:</span> I solemnly confirm that this video was recorded and produced by actual humans without generative AI deepfakes, synthetic voices, or AI generation tools.
            </label>
          </div>

          {/* Progress bar if uploading */}
          {isUploading && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-zinc-500 font-semibold">
                <span>Verifying and Publishing video...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-rose-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !isHumanCertified}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white shadow-lg shadow-rose-600/30 transition-all hover:scale-102 flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Publish Video</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
