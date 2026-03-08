import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Hero from '../components/Hero';
import MovieCard from '../components/MovieCard';
import InterpreterSection from '../components/InterpreterSection';
import type { Movie } from '../types';
import { Loader2, Film, Filter, ChevronRight, Layout, Star } from 'lucide-react';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [challenges, setChallenges] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  
  const category = searchParams.get('category');
  const interpreter = searchParams.get('interpreter');
  const search = searchParams.get('search');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (interpreter) params.append('interpreter', interpreter);
        if (search) params.append('search', search);
        params.append('type', 'movie');

        const shortParams = new URLSearchParams();
        shortParams.append('type', 'short');

        const [moviesRes, shortsRes, categoriesRes] = await Promise.all([
          fetch(`/api/movies?${params.toString()}`),
          fetch(`/api/movies?${shortParams.toString()}`),
          fetch('/api/categories')
        ]);

        const [moviesData, shortsData, categoriesData] = await Promise.all([
          moviesRes.json(),
          shortsRes.json(),
          categoriesRes.json()
        ]);

        setMovies(moviesData);
        setChallenges(shortsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, interpreter, search]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  return (
    <div className="pb-20">
      {!search && !category && !interpreter && movies.length > 0 && (
        <Hero movie={movies[0]} />
      )}

      <div className="max-w-7xl mx-auto px-6 mt-12">
        {/* Main Content Sections */}
        <div className="space-y-20">
          {/* Latest Uploads */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center">
                  <Film className="text-orange-500" size={24} />
                </div>
                <h2 className="text-3xl font-display font-bold tracking-tight">
                  Latest <span className="text-orange-500">Uploads</span>
                </h2>
              </div>
              {!search && !category && !interpreter && (
                <p className="text-white/40 text-sm font-medium">Newest movies first</p>
              )}
            </div>

            {movies.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <Film className="text-white/20" size={40} />
                </div>
                <h3 className="text-xl font-display font-bold mb-2">No movies found</h3>
                <p className="text-white/40 max-w-xs">
                  We couldn't find any movies matching your criteria. Try adjusting your filters or search.
                </p>
              </div>
            )}
          </section>

          {/* Shorts Section */}
          {!search && !category && !interpreter && challenges.length > 0 && (
            <section className="pt-10 border-t border-white/5">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                    <Star className="text-purple-500" size={24} />
                  </div>
                  <h2 className="text-3xl font-display font-bold tracking-tight">
                    Trending <span className="text-purple-500">Shorts</span>
                  </h2>
                </div>
                <p className="text-white/40 text-sm font-medium">Quick clips & comedy</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                {challenges.map((challenge) => (
                  <MovieCard key={`short-${challenge.id}`} movie={challenge} />
                ))}
              </div>
            </section>
          )}

          {/* Trending Section (Only on main home page) */}
          {!search && !category && !interpreter && movies.length > 0 && (
            <section className="pt-10 border-t border-white/5">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center">
                  <Star className="text-orange-500" size={24} />
                </div>
                <h2 className="text-3xl font-display font-bold tracking-tight">
                  Trending <span className="text-orange-500">Now</span>
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                {[...movies]
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 5)
                  .map((movie) => (
                    <MovieCard key={`trending-${movie.id}`} movie={movie} />
                  ))}
              </div>
            </section>
          )}
        </div>

        {/* Categories Section */}
        {!search && !category && !interpreter && (
          <>
            <InterpreterSection />
            
            <div className="mt-32">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center">
                    <Layout className="text-orange-500" size={24} />
                  </div>
                  <h2 className="text-3xl font-display font-bold tracking-tight">
                    Browse by <span className="text-orange-500">Category</span>
                  </h2>
                </div>
                <button className="text-orange-500 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                  View All <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {categories.slice(0, 5).map((cat) => {
                  const categoryImages: Record<string, string> = {
                    'Action': 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400&auto=format&fit=crop',
                    'Cartoon': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop',
                    'Comedy': 'https://images.unsplash.com/photo-1514525253344-f814d074358a?q=80&w=400&auto=format&fit=crop',
                    'Sci-Fi': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop',
                    'Horror': 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=400&auto=format&fit=crop'
                  };

                  return (
                    <Link
                      key={cat}
                      to={`/?category=${cat}`}
                      className="group relative h-48 rounded-3xl overflow-hidden border border-white/10 shadow-lg"
                    >
                      <img
                        src={categoryImages[cat] || `https://picsum.photos/seed/${cat}/400/300`}
                        alt={cat}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.4] group-hover:brightness-[0.6]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        <span className="text-2xl font-display font-bold tracking-tight group-hover:scale-110 transition-transform duration-300">
                          {cat}
                        </span>
                        <div className="w-12 h-1 bg-orange-500 mt-2 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
