import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import JobCard from './components/JobCard';
import FilterSidebar from './components/FilterSidebar';
import JobModal from './components/JobModal';
import ProfileView from './components/ProfileView';
import { Job, UserProfile } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { subscribeToJobs, getUserProfile, createUserProfile } from './services/firebaseService';

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchKeywords, setSearchKeywords] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let profile = await getUserProfile(user.uid);
        if (!profile) {
          profile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            role: 'candidate',
            savedJobs: []
          };
          await createUserProfile(profile);
        }
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Jobs Subscription
  useEffect(() => {
    const unsubscribe = subscribeToJobs(setJobs);
    return () => unsubscribe();
  }, []);

  const handleSearch = (keywords: string, location: string) => {
    setSearchKeywords(keywords.toLowerCase());
    setSearchLocation(location.toLowerCase());
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
      const matchesKeywords = !searchKeywords || 
        job.title.toLowerCase().includes(searchKeywords) || 
        job.companyName.toLowerCase().includes(searchKeywords) ||
        job.description.toLowerCase().includes(searchKeywords);
      const matchesLocation = !searchLocation || 
        job.location.toLowerCase().includes(searchLocation);
      
      return matchesCategory && matchesKeywords && matchesLocation;
    });
  }, [jobs, selectedCategory, searchKeywords, searchLocation]);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-white">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-[6px] border-brand-black border-t-brand-accent rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Initializing Flight Systems</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-white">
      <Navbar 
        userProfile={userProfile} 
        onViewProfile={() => setShowProfile(true)} 
      />
      
      <main className="flex-1">
        <Hero onSearch={handleSearch} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex flex-col lg:flex-row gap-20">
            <FilterSidebar 
              selectedCategory={selectedCategory} 
              onSelectCategory={setSelectedCategory} 
            />

            <div className="flex-1">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <h2 className="text-4xl font-bold text-brand-black tracking-tight mb-2">
                    {selectedCategory === 'all' ? 'Latest Opportunities' : `${selectedCategory} Jobs`}
                  </h2>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    Showing {filteredJobs.length} curated positions
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Sort by</span>
                  <select className="bg-slate-50 border-none rounded-full px-4 py-2 focus:ring-0 font-bold text-brand-black cursor-pointer appearance-none">
                    <option>Newest First</option>
                    <option>Salary Range</option>
                    <option>Company</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredJobs.map((job) => (
                    <motion.div 
                      key={job.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <JobCard 
                        job={job} 
                        onClick={() => setSelectedJob(job)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {filteredJobs.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200"
                >
                  <p className="text-slate-400 font-bold uppercase tracking-widest mb-6">No matching opportunities found</p>
                  <button 
                    onClick={() => {
                      setSearchKeywords('');
                      setSearchLocation('');
                      setSelectedCategory('all');
                    }}
                    className="bg-brand-black text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
                  >
                    Reset all filters
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-brand-black text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 noise-bg opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-white p-2 rounded-xl">
                  <svg className="w-5 h-5 text-brand-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <span className="text-2xl font-bold tracking-tight font-display">SkyHire</span>
              </div>
              <p className="text-slate-400 max-w-sm leading-relaxed font-medium">
                The global leader in aviation recruitment. Connecting world-class talent with the industry's most prestigious airlines and aerospace companies.
              </p>
            </div>
            
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">Platform</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><a href="#" className="hover:text-brand-accent transition-colors">Find Jobs</a></li>
                <li><a href="#" className="hover:text-brand-accent transition-colors">Post a Job</a></li>
                <li><a href="#" className="hover:text-brand-accent transition-colors">Airlines</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">Company</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><a href="#" className="hover:text-brand-accent transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-brand-accent transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-brand-accent transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              © 2026 SkyHire Aviation. All rights reserved.
            </p>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </footer>

      <JobModal 
        job={selectedJob} 
        onClose={() => setSelectedJob(null)} 
        userProfile={userProfile}
      />

      {showProfile && userProfile && (
        <ProfileView 
          userProfile={userProfile} 
          onClose={() => setShowProfile(false)} 
        />
      )}
    </div>
  );
}
