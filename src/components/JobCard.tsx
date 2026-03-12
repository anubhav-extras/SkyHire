import React from 'react';
import { Job } from '../types';
import { MapPin, Clock, DollarSign, ArrowUpRight } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onClick: () => void;
}

export default function JobCard({ job, onClick }: JobCardProps) {
  return (
    <div
      className="bg-white p-8 rounded-[2rem] border border-black/5 hover:border-brand-accent/30 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 cursor-pointer group h-full relative overflow-hidden"
      onClick={onClick}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex items-start justify-between mb-8 relative">
        <div className="flex gap-5">
          <div className="relative">
            <img 
              src={job.logo} 
              alt={job.companyName} 
              className="w-14 h-14 rounded-2xl object-cover border border-black/5 shadow-sm group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-brand-black group-hover:text-brand-accent transition-colors duration-300 leading-tight mb-1">{job.title}</h3>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">{job.companyName}</p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand-black group-hover:text-white transition-all duration-300">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 relative">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
          <MapPin className="w-3 h-3" />
          {job.location}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
          <Clock className="w-3 h-3" />
          {job.type}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-accent/10 text-brand-accent text-[10px] font-bold uppercase tracking-wider">
          <DollarSign className="w-3 h-3" />
          {job.salary}
        </span>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-black/5 relative">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
          {job.postedAt?.toDate ? job.postedAt.toDate().toLocaleDateString() : 'Recently'}
        </span>
        <span className="text-[10px] font-black text-brand-black bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">{job.category}</span>
      </div>
    </div>
  );
}
