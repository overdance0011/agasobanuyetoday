import React from 'react';
import { Play, Star, Eye, Calendar, Globe, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import type { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 transition-all hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10"
    >
      <Link to={`/movie/${movie.id}`}>
        <div className="aspect-[2/3] relative overflow-hidden">
          <img
            src={movie.thumbnail}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-14 h-14 bg-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-600/40 transform scale-75 group-hover:scale-100 transition-transform">
              <Play className="text-white fill-white ml-1" size={28} />
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
              {movie.category}
            </span>
            {movie.type === 'short' && (
              <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                Short
              </span>
            )}
            {movie.video_url.startsWith('data:') && (
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                Local
              </span>
            )}
            {new Date(movie.created_at).getTime() > Date.now() - 24 * 60 * 60 * 1000 && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                New
              </span>
            )}
            <span className="bg-black/60 backdrop-blur-md text-white/80 text-[10px] font-medium px-2 py-1 rounded border border-white/10">
              {movie.interpreter}
            </span>
          </div>

          {/* Origin Badge */}
          {movie.origin && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-white/10 backdrop-blur-md text-white/90 text-[9px] font-bold px-2 py-1 rounded-full border border-white/10 flex items-center gap-1">
                <Globe size={10} />
                {movie.origin}
              </span>
            </div>
          )}

          {/* Duration Badge */}
          {movie.duration && (
            <div className="absolute bottom-3 right-3">
              <span className="bg-black/60 backdrop-blur-md text-white/90 text-[9px] font-bold px-2 py-1 rounded-full border border-white/10 flex items-center gap-1">
                <Clock size={10} />
                {movie.duration}
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-sm font-display font-semibold line-clamp-1 group-hover:text-orange-500 transition-colors">
            {movie.title}
          </h3>
          <div className="mt-3 flex items-center justify-between text-[11px] text-white/50 font-medium">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Star className="text-orange-500 fill-orange-500" size={12} />
                {movie.rating}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={12} />
                {movie.views.toLocaleString()}
              </span>
            </div>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {movie.year}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
