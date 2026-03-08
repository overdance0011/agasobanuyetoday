import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, Users, Loader2 } from 'lucide-react';

interface Interpreter {
  name: string;
  image: string;
  count: number;
}

export default function InterpreterSection() {
  const [interpreters, setInterpreters] = useState<Interpreter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterpreters = async () => {
      try {
        const response = await fetch('/api/interpreters');
        const data = await response.json();
        setInterpreters(data);
      } catch (error) {
        console.error('Error fetching interpreters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterpreters();
  }, []);

  if (loading) {
    return (
      <div className="mt-32 flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-orange-500" size={32} />
      </div>
    );
  }

  return (
    <div className="mt-32">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center">
            <Users className="text-orange-500" size={24} />
          </div>
          <h2 className="text-3xl font-display font-bold tracking-tight">
            Top <span className="text-orange-500">Interpreters</span>
          </h2>
        </div>
        <button className="text-orange-500 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
          View All <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {interpreters.map((translator, index) => (
          <motion.div
            key={translator.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={`/?interpreter=${translator.name}`}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative w-24 h-24 md:w-32 md:h-32 mb-4">
                <div className="absolute inset-0 bg-orange-500 rounded-full scale-0 group-hover:scale-105 transition-transform duration-300 opacity-20" />
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-500 rounded-full transition-all duration-300" />
                <img
                  src={translator.image}
                  alt={translator.name}
                  className="w-full h-full object-cover rounded-full border-4 border-white/5 grayscale group-hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-1 right-2 bg-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                  {translator.count}
                </div>
              </div>
              <h3 className="font-display font-bold text-sm md:text-base group-hover:text-orange-500 transition-colors">
                {translator.name}
              </h3>
              <span className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                Professional Interpreter
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
