import React from 'react';
import { Search, MapPin, Plane, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onSearch: (keywords: string, location: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const [keywords, setKeywords] = React.useState('');
  const [location, setLocation] = React.useState('');

  const handleSearch = () => {
    onSearch(keywords, location);
  };

  return (
    <section className="relative pt-40 pb-32 overflow-hidden bg-brand-white">
      {/* Background Elements */}
      <div className="absolute inset-0 noise-bg pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[70%] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[60%] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-black text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-8 shadow-2xl shadow-black/20">
              <Plane className="w-3 h-3" />
              Next-Gen Aviation Careers
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold tracking-[-0.04em] text-brand-black mb-8 leading-[0.9] text-balance">
              Elevate your <span className="text-brand-accent italic font-light">career</span> beyond the horizon.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 mb-16 max-w-2xl mx-auto leading-relaxed font-medium">
              The premier destination for aviation professionals. Connect with global leaders in flight, engineering, and operations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-3xl"
          >
            <div className="glass p-2 rounded-[2rem] shadow-2xl shadow-black/5 border border-white/40 flex flex-col md:flex-row gap-2">
              <div className="flex-[1.5] flex items-center px-6 py-4 gap-4 group">
                <Search className="w-5 h-5 text-slate-400 group-focus-within:text-brand-accent transition-colors" />
                <input 
                  type="text" 
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Role, airline, or skill" 
                  className="w-full bg-transparent border-none focus:ring-0 text-brand-black placeholder:text-slate-400 text-base font-medium"
                />
              </div>
              <div className="flex-1 flex items-center px-6 py-4 gap-4 border-t md:border-t-0 md:border-l border-black/5 group">
                <MapPin className="w-5 h-5 text-slate-400 group-focus-within:text-brand-accent transition-colors" />
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location" 
                  className="w-full bg-transparent border-none focus:ring-0 text-brand-black placeholder:text-slate-400 text-base font-medium"
                />
              </div>
              <button 
                onClick={handleSearch}
                className="bg-brand-black text-white px-10 py-4 rounded-[1.5rem] font-bold hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-2 group active:scale-95"
              >
                Explore
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="mt-10 flex flex-wrap justify-center gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              <span className="flex items-center gap-2">Trending: 
                <span onClick={() => onSearch('Captain', '')} className="text-brand-black cursor-pointer hover:text-brand-accent transition-colors">Captain</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span onClick={() => onSearch('Engineer', '')} className="text-brand-black cursor-pointer hover:text-brand-accent transition-colors">Engineer</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span onClick={() => onSearch('Cabin', '')} className="text-brand-black cursor-pointer hover:text-brand-accent transition-colors">Cabin Crew</span>
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
