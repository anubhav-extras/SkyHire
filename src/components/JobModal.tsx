import React, { useState } from 'react';
import { Job, UserProfile } from '../types';
import { X, MapPin, Clock, DollarSign, Briefcase, CheckCircle2, Share2, Bookmark, BookmarkCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { applyToJob, toggleSaveJob } from '../services/firebaseService';

interface JobModalProps {
  job: Job | null;
  onClose: () => void;
  userProfile?: UserProfile | null;
}

export default function JobModal({ job, onClose, userProfile }: JobModalProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  if (!job) return null;

  const isSaved = userProfile?.savedJobs?.includes(job.id);

  const handleApply = async () => {
    if (!userProfile) {
      alert('Please sign in to apply');
      return;
    }
    setIsApplying(true);
    try {
      await applyToJob(job.id, userProfile.uid);
      setApplied(true);
    } catch (error) {
      console.error('Apply error:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleToggleSave = async () => {
    if (!userProfile) {
      alert('Please sign in to save jobs');
      return;
    }
    await toggleSaveJob(userProfile.uid, job.id, !!isSaved);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-black/40 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          className="relative w-full max-w-4xl bg-brand-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden max-h-[90vh] flex flex-col border border-white/20"
        >
          <div className="flex justify-between items-center p-10 border-b border-black/5">
            <div className="flex items-center gap-6">
              <img 
                src={job.logo} 
                alt={job.companyName} 
                className="w-16 h-16 rounded-[1.5rem] object-cover border border-black/5 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div>
                <h2 className="text-2xl font-bold text-brand-black leading-tight mb-1">{job.title}</h2>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">{job.companyName}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-slate-100 rounded-full transition-all duration-300 active:scale-90"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              <div className="p-6 rounded-[2rem] bg-slate-50 border border-black/5">
                <MapPin className="w-4 h-4 text-brand-accent mb-3" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Location</span>
                <span className="text-sm font-bold text-brand-black">{job.location}</span>
              </div>
              <div className="p-6 rounded-[2rem] bg-slate-50 border border-black/5">
                <Clock className="w-4 h-4 text-brand-accent mb-3" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Job Type</span>
                <span className="text-sm font-bold text-brand-black">{job.type}</span>
              </div>
              <div className="p-6 rounded-[2rem] bg-slate-50 border border-black/5">
                <DollarSign className="w-4 h-4 text-brand-accent mb-3" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Salary</span>
                <span className="text-sm font-bold text-brand-black">{job.salary}</span>
              </div>
              <div className="p-6 rounded-[2rem] bg-slate-50 border border-black/5">
                <Briefcase className="w-4 h-4 text-brand-accent mb-3" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Category</span>
                <span className="text-sm font-bold text-brand-black">{job.category}</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                <div>
                  <h3 className="text-xl font-bold text-brand-black mb-6">Job Description</h3>
                  <p className="text-slate-500 leading-relaxed font-medium text-lg">
                    {job.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-brand-black mb-6">Requirements</h3>
                  <ul className="space-y-4">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-4 text-slate-500 font-medium">
                        <div className="w-6 h-6 rounded-full bg-brand-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-4 h-4 text-brand-accent" />
                        </div>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-8 rounded-[2.5rem] bg-brand-black text-white shadow-2xl shadow-black/20">
                  <h4 className="text-lg font-bold mb-4">Quick Apply</h4>
                  <p className="text-xs text-slate-400 mb-8 leading-relaxed font-medium">Your profile information will be shared with the hiring team.</p>
                  <button 
                    onClick={handleApply}
                    disabled={isApplying || applied}
                    className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 active:scale-95 ${
                      applied 
                      ? 'bg-emerald-500 text-white cursor-default' 
                      : 'bg-brand-accent hover:bg-blue-600 text-white shadow-lg shadow-brand-accent/20'
                    }`}
                  >
                    {isApplying ? 'Applying...' : applied ? 'Applied Successfully' : 'Apply Now'}
                  </button>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={handleToggleSave}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold border-2 transition-all duration-300 active:scale-95 ${
                      isSaved ? 'bg-brand-accent/10 border-brand-accent text-brand-accent' : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                    {isSaved ? 'Saved' : 'Save Job'}
                  </button>
                  <button className="p-4 border-2 border-slate-100 rounded-2xl hover:bg-slate-50 text-slate-600 transition-all duration-300 active:scale-95">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
