import React from 'react';
import { Film, Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#050301] border-t border-white/5 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <Film className="text-white" size={24} />
            </div>
            <span className="text-xl font-display font-bold tracking-tighter">
              AGASOBANUYE<span className="text-orange-500">TODAY</span>
            </span>
          </Link>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            The #1 platform for translated movies in Rwanda. We bring you the best Agasobanuye films from your favorite translators.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-600 transition-colors">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-600 transition-colors">
              <Twitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-600 transition-colors">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-600 transition-colors">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-display font-bold mb-6">Quick Links</h4>
          <ul className="flex flex-col gap-4 text-sm text-white/50">
            <li><Link to="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
            <li><Link to="/?category=Action" className="hover:text-orange-500 transition-colors">Action Movies</Link></li>
            <li><Link to="/?category=Adventure" className="hover:text-orange-500 transition-colors">Adventure</Link></li>
            <li><Link to="/?category=Sci-Fi" className="hover:text-orange-500 transition-colors">Sci-Fi</Link></li>
            <li><Link to="/?category=Animation" className="hover:text-orange-500 transition-colors">Animation</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-display font-bold mb-6">Categories</h4>
          <ul className="flex flex-col gap-4 text-sm text-white/50">
            <li><Link to="/?category=Action" className="hover:text-orange-500 transition-colors">Action</Link></li>
            <li><Link to="/?category=Cartoon" className="hover:text-orange-500 transition-colors">Cartoon</Link></li>
            <li><Link to="/?category=Comedy" className="hover:text-orange-500 transition-colors">Comedy</Link></li>
            <li><Link to="/?category=Sci-Fi" className="hover:text-orange-500 transition-colors">Sci-Fi</Link></li>
            <li><Link to="/?category=Horror" className="hover:text-orange-500 transition-colors">Horror</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-display font-bold mb-6">Interpreters</h4>
          <ul className="flex flex-col gap-4 text-sm text-white/50">
            <li><Link to="/?interpreter=Rocky Kimomo" className="hover:text-orange-500 transition-colors">Rocky Kimomo</Link></li>
            <li><Link to="/?interpreter=Junior Giti" className="hover:text-orange-500 transition-colors">Junior Giti</Link></li>
            <li><Link to="/?interpreter=Sankara" className="hover:text-orange-500 transition-colors">Sankara</Link></li>
            <li><Link to="/?interpreter=Skovi" className="hover:text-orange-500 transition-colors">Skovi</Link></li>
            <li><Link to="/?interpreter=Be the Great" className="hover:text-orange-500 transition-colors">Be the Great</Link></li>
            <li><Link to="/?interpreter=Pati" className="hover:text-orange-500 transition-colors">Pati</Link></li>
            <li><Link to="/?interpreter=Dany" className="hover:text-orange-500 transition-colors">Dany</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-display font-bold mb-6">Contact Us</h4>
          <ul className="flex flex-col gap-4 text-sm text-white/50">
            <li className="flex items-center gap-3">
              <MapPin size={18} className="text-orange-500" />
              Kigali, Rwanda
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-orange-500" />
              +250 788 000 000
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-orange-500" />
              info@agasobanuyetoday.com
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/30">
        <p>© 2024 Agasobanuye Today. All rights reserved.</p>
        <div className="flex items-center gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}
