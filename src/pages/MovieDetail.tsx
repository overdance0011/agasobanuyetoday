import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Star, Eye, Calendar, Clock, Share2, ThumbsUp, MessageSquare, ChevronLeft, Loader2, ChevronRight, Globe } from 'lucide-react';
import type { Movie } from '../types';
import MovieCard from '../components/MovieCard';

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [interpreters, setInterpreters] = useState<{name: string, count: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      try {
        const movieRes = await fetch(`/api/movies/${id}`);
        const movieData = await movieRes.json();
        setMovie(movieData);

        if (movieData.category) {
          const relatedRes = await fetch(`/api/movies?category=${movieData.category}`);
          const relatedData = await relatedRes.json();
          setRelatedMovies(relatedData.filter((m: Movie) => m.id !== parseInt(id!)).slice(0, 5));
        }

        const interpretersRes = await fetch('/api/interpreters');
        const interpretersData = await interpretersRes.json();
        setInterpreters(interpretersData.slice(0, 9));
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl font-display font-bold mb-4">Movie Not Found</h2>
        <p className="text-white/50 mb-8">The movie you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      {/* Background Blur */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <img
          src={movie.thumbnail}
          alt=""
          className="w-full h-full object-cover scale-150 blur-[100px] opacity-20"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Movies
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Video Player & Info */}
          <div className="lg:col-span-2">
            <div className="aspect-video w-full bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 group relative">
              {movie.video_url.startsWith('data:') ? (
                <video 
                  src={movie.video_url} 
                  controls 
                  className="w-full h-full object-contain"
                  poster={movie.thumbnail}
                />
              ) : movie.video_url.includes('tiktok.com') ? (
                <iframe
                  src={movie.video_url}
                  title={movie.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : movie.video_url.includes('instagram.com') ? (
                <iframe
                  src={movie.video_url}
                  title={movie.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <iframe
                  src={movie.video_url}
                  title={movie.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>

            <div className="mt-10">
              <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
                <div>
                  <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
                    {movie.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-6 text-sm text-white/50 font-medium">
                    <div className="flex items-center gap-2">
                      <Star className="text-orange-500 fill-orange-500" size={18} />
                      <span className="text-white">{movie.rating}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={18} />
                      <span>{movie.year}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye size={18} />
                      <span>{movie.views.toLocaleString()} views</span>
                    </div>
                    {movie.duration && (
                      <div className="flex items-center gap-2">
                        <Clock size={18} />
                        <span>{movie.duration}</span>
                      </div>
                    )}
                    {movie.origin && (
                      <div className="flex items-center gap-2">
                        <Globe size={18} />
                        <span>{movie.origin}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        {movie.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full border border-white/10 transition-all">
                    <ThumbsUp size={18} />
                    Like
                  </button>
                  <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full border border-white/10 transition-all">
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
              </div>

              <div className="glass rounded-3xl p-8 mb-12">
                <h3 className="text-lg font-display font-bold mb-4">Description</h3>
                <p className="text-white/70 leading-relaxed mb-8">
                  {movie.description}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/10">
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">Interpreter</span>
                    <span className="font-medium text-orange-500">{movie.interpreter}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">Origin</span>
                    <span className="font-medium">{movie.origin || 'Unknown'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">Duration</span>
                    <span className="font-medium">{movie.duration || 'Unknown'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">Quality</span>
                    <span className="font-medium">HD 1080p</span>
                  </div>
                </div>
              </div>

              {/* Comments Section Placeholder */}
              <div>
                <h3 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
                  <MessageSquare size={24} className="text-orange-500" />
                  Comments
                </h3>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                  <textarea
                    placeholder="Add a comment..."
                    className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-white/20 resize-none h-24"
                  ></textarea>
                  <div className="flex justify-end pt-4 border-t border-white/10">
                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full text-sm font-bold transition-all">
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-10">
            <div>
              <h3 className="text-xl font-display font-bold mb-6 flex items-center justify-between">
                Related Movies
                <Link to={`/?category=${movie.category}`} className="text-orange-500 text-xs font-bold uppercase tracking-widest">
                  See All
                </Link>
              </h3>
              <div className="flex flex-col gap-6">
                {relatedMovies.map((m) => (
                  <Link key={m.id} to={`/movie/${m.id}`} className="group flex gap-4">
                    <div className="w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden border border-white/10">
                      <img
                        src={m.thumbnail}
                        alt={m.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-sm font-display font-bold line-clamp-2 group-hover:text-orange-500 transition-colors">
                        {m.title}
                      </h4>
                      <div className="mt-2 flex items-center gap-3 text-[10px] text-white/40 uppercase tracking-wider">
                        <span>{m.year}</span>
                        <span>•</span>
                        <span>{m.category}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-orange-500 font-bold">
                        <Star size={10} fill="currentColor" />
                        {m.rating}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-6">
              <h3 className="text-lg font-display font-bold mb-4">Top Interpreters</h3>
              <div className="space-y-4">
                {interpreters.map((t) => (
                  <Link
                    key={t.name}
                    to={`/?interpreter=${t.name}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <span className="text-sm font-medium group-hover:text-orange-500">{t.name}</span>
                    <ChevronRight size={16} className="text-white/20 group-hover:text-orange-500" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
