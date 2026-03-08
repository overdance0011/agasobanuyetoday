import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Hero from '../components/Hero';
import MovieCard from '../components/MovieCard';
import TranslatorSection from '../components/TranslatorSection';
import type { Movie } from '../types';
import { Loader2, Film, Filter, ChevronRight } from 'lucide-react';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  
  const category = searchParams.get('category');
  const translator = searchParams.get('translator');
  const search = searchParams.get('search');

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (translator) params.append('translator', translator);
        if (search) params.append('search', search);

        const response = await fetch(`/api/movies?${params.toString()}`);
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [category, translator, search]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  return (
    <div className="pb-20">
      {!search && !category && !translator && movies.length > 0 && (
        <Hero movie={movies[0]} />
      )}

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
              {search ? (
                <>Search Results for "<span className="text-orange-500">{search}</span>"</>
              ) : category ? (
                <>{category} <span className="text-orange-500">Movies</span></>
              ) : translator ? (
                <>Movies by <span className="text-orange-500">{translator}</span></>
              ) : (
                <>Latest <span className="text-orange-500">Uploads</span></>
              )}
            </h2>
            <p className="text-white/40 text-sm mt-2">
              {movies.length} movies found in this collection
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10 text-sm font-medium transition-colors">
              <Filter size={16} />
              Filter
            </button>
            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10 text-sm font-medium transition-colors">
              Sort by: Newest
            </button>
          </div>
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

        {/* Categories Section */}
        {!search && !category && !translator && (
          <>
            <TranslatorSection />
            
            <div className="mt-32">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-display font-bold tracking-tight">
                  Browse by <span className="text-orange-500">Category</span>
                </h2>
                <button className="text-orange-500 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                  View All <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Action', 'Sci-Fi', 'Adventure', 'Animation'].map((cat) => (
                  <a
                    key={cat}
                    href={`/?category=${cat}`}
                    className="group relative h-32 rounded-2xl overflow-hidden border border-white/10"
                  >
                    <img
                      src={`https://picsum.photos/seed/${cat}/400/200`}
                      alt={cat}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 brightness-50"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-display font-bold tracking-tight group-hover:scale-110 transition-transform">
                        {cat}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
