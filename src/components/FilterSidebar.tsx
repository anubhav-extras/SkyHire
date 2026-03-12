import React from 'react';
import { CATEGORIES } from '../constants';
import { Filter } from 'lucide-react';

interface FilterSidebarProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export default function FilterSidebar({ selectedCategory, onSelectCategory }: FilterSidebarProps) {
  return (
    <aside className="w-full lg:w-72 space-y-12">
      <div className="glass p-8 rounded-[2.5rem] border border-black/5">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em] flex items-center gap-2">
            <Filter className="w-3 h-3" />
            Categories
          </h3>
        </div>
        <div className="space-y-2">
          <button
            onClick={() => onSelectCategory('all')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
              selectedCategory === 'all' 
                ? 'bg-brand-black text-white shadow-xl shadow-black/10' 
                : 'text-slate-400 hover:text-brand-black hover:bg-slate-100'
            }`}
          >
            All Opportunities
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                selectedCategory === cat.name 
                  ? 'bg-brand-black text-white shadow-xl shadow-black/10' 
                  : 'text-slate-400 hover:text-brand-black hover:bg-slate-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8">
        <h3 className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em] mb-8">Job Type</h3>
        <div className="space-y-5">
          {['Full-time', 'Contract', 'Part-time'].map((type) => (
            <label key={type} className="flex items-center gap-4 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input type="checkbox" className="peer appearance-none w-5 h-5 rounded-lg border-2 border-slate-200 checked:bg-brand-black checked:border-brand-black transition-all cursor-pointer" />
                <div className="absolute w-2 h-2 bg-white rounded-sm opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
              </div>
              <span className="text-sm font-bold text-slate-400 group-hover:text-brand-black transition-colors">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-8">
        <div className="bg-brand-black rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-black/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/20 rounded-full -mr-16 -mt-16 blur-3xl" />
          <h4 className="text-xl font-bold mb-3 relative z-10 leading-tight">Get Job Alerts</h4>
          <p className="text-xs text-slate-400 mb-8 relative z-10 font-medium leading-relaxed">Be the first to see new aviation opportunities delivered to your inbox.</p>
          <div className="space-y-3 relative z-10">
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm placeholder:text-white/20 focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all"
            />
            <button className="w-full bg-brand-accent hover:bg-blue-600 text-white py-4 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg shadow-brand-accent/20 active:scale-95">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
