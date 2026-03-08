import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, Film, Image as ImageIcon, Type, Layout, User, Calendar, AlertCircle, CheckCircle2, Loader2, Globe, Clock, PlayCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [videoSource, setVideoSource] = useState<'url' | 'file'>('url');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    video_url: '',
    category: 'Comedy',
    interpreter: 'Capull',
    origin: 'American',
    duration: '',
    year: new Date().getFullYear().toString(),
    type: 'movie',
    autoSuffix: true
  });

  const categories = ['Comedy', 'Action', 'Cartoon', 'Adventure', 'Sci-Fi', 'Horror', 'Drama', 'Fantasy', 'Sport', 'Other'];
  const [interpreters, setInterpreters] = useState<string[]>(['Capull', 'Rocky Kimomo', 'Junior Giti', 'Sankara', 'Skovi', 'Be the Great', 'Yanga', 'Pati', 'Dany', 'Zizou']);
  const origins = ['American', 'Indian', 'Chinese', 'Korean', 'Japanese', 'European', 'African', 'Other'];

  const getVideoEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Handle already embed urls
    if (url.includes('/embed/')) return url;

    // YouTube
    const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const ytMatch = url.match(ytRegExp);
    if (ytMatch && ytMatch[2].length === 11) {
      return `https://www.youtube.com/embed/${ytMatch[2]}`;
    }

    // TikTok
    const ttRegExp = /tiktok\.com\/.*\/video\/(\d+)/;
    const ttMatch = url.match(ttRegExp);
    if (ttMatch) {
      return `https://www.tiktok.com/embed/v2/${ttMatch[1]}`;
    }

    // Instagram
    const igRegExp = /instagram\.com\/(?:p|reels|reel)\/([A-Za-z0-9_-]+)/;
    const igMatch = url.match(igRegExp);
    if (igMatch) {
      return `https://www.instagram.com/p/${igMatch[1]}/embed`;
    }

    // Try to extract from short urls or other formats for YouTube
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'youtu.be') {
        return `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`;
      }
      if (urlObj.hostname.includes('youtube.com')) {
        const v = urlObj.searchParams.get('v');
        if (v) return `https://www.youtube.com/embed/${v}`;
      }
    } catch (e) {
      // Not a valid URL or other error
    }

    return url;
  };

  useEffect(() => {
    const fetchInterpreters = async () => {
      try {
        const response = await fetch('/api/interpreters');
        const data = await response.json();
        if (Array.isArray(data)) {
          const names = data.map((i: any) => i.name);
          setInterpreters(prev => Array.from(new Set([...prev, ...names])));
        }
      } catch (error) {
        console.error('Error fetching interpreters:', error);
      }
    };

    fetchInterpreters();
    if (formData.video_url && !formData.video_url.startsWith('data:')) {
      setVideoPreviewUrl(getVideoEmbedUrl(formData.video_url));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    if (name === 'video_url') {
      const embedUrl = getVideoEmbedUrl(value);
      setFormData(prev => ({ ...prev, [name]: value }));
      setVideoPreviewUrl(embedUrl);
    } else {
      setFormData(prev => ({ ...prev, [name]: val }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        setFormData(prev => ({ ...prev, thumbnail: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const [isDraggingVideo, setIsDraggingVideo] = useState(false);

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processVideoFile(file);
  };

  const processVideoFile = (file: File | undefined) => {
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setError('Video size must be less than 50MB');
        return;
      }
      
      // Cleanup old blob URL if it exists
      if (videoPreviewUrl && videoPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoPreviewUrl);
      }

      // Create a local URL for the preview
      const localUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(localUrl);
      
      // Read as base64 for the form data
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, video_url: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingVideo(true);
  };

  const handleVideoDragLeave = () => {
    setIsDraggingVideo(false);
  };

  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingVideo(false);
    const file = e.dataTransfer.files?.[0];
    processVideoFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Only convert to embed if it's a URL source
    const finalVideoUrl = videoSource === 'url' ? getVideoEmbedUrl(formData.video_url) : formData.video_url;
    
    let finalTitle = formData.title;
    if (formData.type === 'movie' && formData.autoSuffix && !finalTitle.toLowerCase().includes('agasobanuye')) {
      finalTitle = `${finalTitle} (Agasobanuye by ${formData.interpreter})`;
    }

    try {
      const response = await fetch('/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          title: finalTitle,
          video_url: finalVideoUrl,
          year: parseInt(formData.year)
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload movie');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 md:p-12 border border-white/10"
        >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center">
                <UploadIcon className="text-orange-500" size={28} />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-display font-bold">Upload <span className="text-orange-500">Content</span></h1>
                <p className="text-white/50 text-sm">Share your favorite movies or short clips</p>
              </div>
              <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'movie' }))}
                  className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${formData.type === 'movie' ? 'bg-orange-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                >
                  Full Movie
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'short' }))}
                  className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${formData.type === 'short' ? 'bg-orange-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                >
                  Short Video
                </button>
              </div>
            </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-8 flex items-center gap-3">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-xl mb-8 flex items-center gap-3">
              <CheckCircle2 size={20} />
              <p className="text-sm font-medium">Movie uploaded successfully! It is now live under {formData.interpreter}'s collection.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column: Details */}
              <div className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <Type size={14} /> {formData.type === 'movie' ? 'Movie' : 'Video'} Title
                  </label>
                  <input
                    required
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder={formData.type === 'movie' ? "e.g. John Wick 4" : "e.g. Funny Cat Moment"}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  {formData.type === 'movie' && (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        id="autoSuffix"
                        name="autoSuffix"
                        checked={formData.autoSuffix}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-orange-600 focus:ring-orange-500"
                      />
                      <label htmlFor="autoSuffix" className="text-[10px] text-white/50 cursor-pointer">
                        Automatically add "(Agasobanuye by {formData.interpreter})" to title
                      </label>
                    </div>
                  )}
                </div>

                {/* Video Source Toggle */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <Film size={14} /> Video Content
                    </label>
                    <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                      <button
                        type="button"
                        onClick={() => {
                          setVideoSource('url');
                          setVideoPreviewUrl(getVideoEmbedUrl(formData.video_url));
                        }}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${videoSource === 'url' ? 'bg-orange-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                      >
                        Social Link
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setVideoSource('file');
                          setVideoPreviewUrl(null);
                        }}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${videoSource === 'file' ? 'bg-orange-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                      >
                        Local File
                      </button>
                    </div>
                  </div>

                  {videoSource === 'url' ? (
                    <div className="space-y-2">
                      <input
                        required={videoSource === 'url'}
                        type="text"
                        name="video_url"
                        value={formData.video_url.startsWith('data:') ? '' : formData.video_url}
                        onChange={handleChange}
                        placeholder="Paste YouTube, TikTok, or Instagram link..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                      />
                      <p className="text-[10px] text-white/30 italic">Tip: We support YouTube, TikTok, and Instagram links!</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div 
                        onClick={() => videoInputRef.current?.click()}
                        onDragOver={handleVideoDragOver}
                        onDragLeave={handleVideoDragLeave}
                        onDrop={handleVideoDrop}
                        className={`w-full bg-white/5 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group ${isDraggingVideo ? 'border-orange-500 bg-orange-500/10' : 'border-white/10 hover:border-orange-500/50'}`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isDraggingVideo ? 'bg-orange-600 text-white' : 'bg-white/5 text-white/20 group-hover:bg-orange-600/20 group-hover:text-orange-500'}`}>
                          <UploadIcon size={24} />
                        </div>
                        <div className="text-center">
                          <p className={`text-sm font-bold transition-colors ${isDraggingVideo ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                            {formData.video_url.startsWith('data:') ? 'Video Selected' : isDraggingVideo ? 'Drop video here' : 'Click or drag video file to upload'}
                          </p>
                          <p className="text-[10px] text-white/30 mt-1">MP4, WebM or Ogg (Max 50MB)</p>
                        </div>
                      </div>
                      <input
                        type="file"
                        ref={videoInputRef}
                        onChange={handleVideoFileChange}
                        accept="video/*"
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Origin */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <Globe size={14} /> Origin
                    </label>
                    <select
                      name="origin"
                      value={formData.origin}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none"
                    >
                      {origins.map(o => <option key={o} value={o} className="bg-[#0a0502]">{o}</option>)}
                    </select>
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <Clock size={14} /> Duration
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="e.g. 2h 15m"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <Layout size={14} /> Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none"
                    >
                      {categories.map(c => <option key={c} value={c} className="bg-[#0a0502]">{c}</option>)}
                    </select>
                  </div>

                  {/* Interpreter */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <User size={14} /> Interpreter
                    </label>
                    <div className="flex gap-2">
                      <select
                        name="interpreter"
                        value={formData.interpreter}
                        onChange={handleChange}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none"
                      >
                        {interpreters.map(i => <option key={i} value={i} className="bg-[#0a0502]">{i}</option>)}
                      </select>
                      <button 
                        type="button"
                        onClick={() => {
                          const name = prompt('Enter new interpreter name:');
                          if (name) {
                            setInterpreters(prev => Array.from(new Set([...prev, name])));
                            setFormData(prev => ({ ...prev, interpreter: name }));
                          }
                        }}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 hover:bg-white/10 transition-colors text-xs font-bold"
                      >
                        Add New
                      </button>
                    </div>
                  </div>
                </div>

                {/* Year */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <Calendar size={14} /> Release Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              {/* Right Column: Media Preview */}
              <div className="space-y-8">
                {/* Video Preview */}
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <PlayCircle size={14} /> Video Preview
                  </label>
                  <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
                    {videoPreviewUrl ? (
                      videoSource === 'url' ? (
                        <iframe
                          src={videoPreviewUrl}
                          title="Preview"
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <video 
                          src={videoPreviewUrl} 
                          controls 
                          className="w-full h-full object-contain"
                        />
                      )
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/20">
                        <Film size={48} />
                        <p className="text-sm font-bold">
                          {videoSource === 'url' ? 'Enter a video URL' : 'Select a video file'} to see preview
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <ImageIcon size={14} /> {formData.type === 'movie' ? 'Movie' : 'Video'} Thumbnail
                  </label>
                  
                  <div className="flex gap-6">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="relative aspect-[2/3] w-32 rounded-2xl border-2 border-dashed border-white/10 hover:border-orange-500/50 transition-all cursor-pointer overflow-hidden group flex-shrink-0"
                    >
                      {previewImage || formData.thumbnail ? (
                        <>
                          <img 
                            src={previewImage || formData.thumbnail} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            <UploadIcon size={20} className="text-orange-500" />
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/20">
                          <ImageIcon size={24} />
                          <span className="text-[8px] font-bold text-center px-2">Click to Upload</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Or use Unsplash/Web URL</p>
                        <input
                          type="url"
                          name="thumbnail"
                          value={formData.thumbnail.startsWith('data:') ? '' : formData.thumbnail}
                          onChange={handleChange}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>
                      <p className="text-[10px] text-white/30 italic">A good thumbnail makes your movie stand out!</p>
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder={formData.type === 'movie' ? "Tell us about this movie..." : "Tell us about this video..."}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors resize-none"
              ></textarea>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-orange-600/20"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <UploadIcon size={24} />
                  Publish {formData.type === 'movie' ? 'Movie' : 'Short'}
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
