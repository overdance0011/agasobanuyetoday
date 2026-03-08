import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Film, User, TrendingUp, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        isScrolled ? 'glass py-3' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex flex-col">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Film className="text-white" size={24} />
            </div>
            <span className="text-xl font-display font-bold tracking-tighter">
              AGASOBANUYE<span className="text-orange-500">TODAY</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-4 mt-1 ml-12">
            <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-orange-500 hover:text-white transition-colors flex items-center gap-1">
              <TrendingUp size={10} />
              Trending Now
            </Link>
            <Link to="/?category=Action" className="text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-orange-500 transition-colors">
              Action
            </Link>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium hover:text-orange-500 transition-colors">Home</Link>
          <Link to="/?category=Action" className="text-sm font-medium hover:text-orange-500 transition-colors">Action</Link>
          <Link to="/?category=Cartoon" className="text-sm font-medium hover:text-orange-500 transition-colors">Cartoon</Link>
          <Link to="/?category=Comedy" className="text-sm font-medium hover:text-orange-500 transition-colors">Comedy</Link>
          <div className="relative group/dropdown">
            <button className="text-sm font-medium hover:text-orange-500 transition-colors flex items-center gap-1">
              Interpreters
            </button>
            <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-300">
              <div className="glass rounded-xl p-4 w-48 border border-white/10 shadow-2xl max-h-[60vh] overflow-y-auto">
                {['Rocky Kimomo', 'Junior Giti', 'Sankara', 'Skovi', 'Be the Great', 'Yanga', 'Pati', 'Dany', 'Zizou'].map((t) => (
                  <Link
                    key={t}
                    to={`/?interpreter=${t}`}
                    className="block py-2 text-xs hover:text-orange-500 transition-colors"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSearch} className="relative group">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 w-64 transition-all group-hover:bg-white/10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-hover:text-white/70" size={16} />
          </form>

          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <User size={20} />
          </button>

          <Link 
            to="/upload" 
            className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-orange-600/20"
          >
            <Upload size={14} />
            Upload
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass border-t border-white/10 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSearch} className="relative mb-6">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 w-full"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          </form>
          <div className="flex flex-col gap-4">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium flex items-center gap-2">
              <TrendingUp size={20} className="text-orange-500" />
              Trending Now
            </Link>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">Home</Link>
            <Link to="/?category=Action" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">Action</Link>
            <Link to="/?category=Cartoon" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">Cartoon</Link>
            <Link to="/?category=Comedy" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">Comedy</Link>
            <div className="pt-4 border-t border-white/10">
              <span className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-4">Top Interpreters</span>
              <div className="grid grid-cols-2 gap-4 max-h-48 overflow-y-auto pr-2">
                {['Rocky Kimomo', 'Junior Giti', 'Sankara', 'Skovi', 'Be the Great', 'Yanga', 'Pati', 'Dany', 'Zizou'].map((t) => (
                  <Link
                    key={t}
                    to={`/?interpreter=${t}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-medium hover:text-orange-500 transition-colors"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
