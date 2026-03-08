import React from 'react';
import { Play, Info, Star, TrendingUp, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import type { Movie } from '../types';

interface HeroProps {
  movie: Movie;
}

export default function Hero({ movie }: HeroProps) {
  return (
    <div className="relative h-[90vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={movie.thumbnail}
          alt={movie.title}
          className="w-full h-full object-cover scale-110 blur-sm brightness-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0502] via-[#0a0502]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0502] via-[#0a0502]/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={14} />
              Trending Now
            </span>
            <span className="bg-white/10 backdrop-blur-md text-white/80 text-xs font-medium px-3 py-1 rounded-full border border-white/10">
              {movie.category}
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter leading-[0.9] mb-6 text-gradient">
            {movie.title}
          </h1>

          <div className="flex items-center gap-6 mb-8 text-sm text-white/60 font-medium">
            <div className="flex items-center gap-2">
              <Star className="text-orange-500 fill-orange-500" size={18} />
              <span className="text-white">{movie.rating}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{movie.year}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>2h 15m</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase">
                {movie.interpreter}
              </span>
            </div>
          </div>

          <p className="text-lg text-white/70 mb-10 line-clamp-3 leading-relaxed max-w-xl">
            {movie.description}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to={`/movie/${movie.id}`}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 transition-all hover:scale-105 shadow-xl shadow-orange-600/20"
            >
              <Play className="fill-white" size={24} />
              Watch Now
            </Link>
            <Link
              to={`/movie/${movie.id}`}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 transition-all border border-white/10"
            >
              <Info size={24} />
              More Info
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <div className="w-1 h-12 bg-gradient-to-b from-orange-500 to-transparent rounded-full" />
      </div>
    </div>
  );
}
