import React, { useState, useEffect } from 'react';
import { UserProfile, CompanyProfile, Application } from '../types';
import { 
  User as UserIcon, 
  Building, 
  Mail, 
  FileText, 
  Bookmark, 
  History, 
  ExternalLink, 
  CheckCircle2,
  ChevronRight,
  Settings,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { updateUserProfile, subscribeToUserApplications, getCompany } from '../services/firebaseService';
import { auth } from '../firebase';

interface ProfileViewProps {
  userProfile: UserProfile;
  onClose: () => void;
}

export default function ProfileView({ userProfile, onClose }: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'applications' | 'saved' | 'company'>('profile');
  const [applications, setApplications] = useState<Application[]>([]);
  const [company, setCompany] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    if (userProfile.uid) {
      const unsubscribe = subscribeToUserApplications(userProfile.uid, setApplications);
      return () => unsubscribe();
    }
  }, [userProfile.uid]);

  useEffect(() => {
    if (userProfile.role === 'company_admin' && userProfile.companyId) {
      getCompany(userProfile.companyId).then(setCompany);
    }
  }, [userProfile.role, userProfile.companyId]);

  const handleUpdateBio = async (bio: string) => {
    await updateUserProfile(userProfile.uid, { bio });
  };

  const handleSignOut = () => {
    auth.signOut();
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-brand-white overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-20">
          <button 
            onClick={onClose} 
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-brand-black transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Back to Terminal
          </button>
          
          <div className="flex items-center gap-6">
            <button className="p-2 text-slate-400 hover:text-brand-black transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-red-500 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-12">
            <div className="flex flex-col items-center lg:items-start">
              <div className="relative mb-8">
                <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden bg-slate-100 border-4 border-white shadow-2xl">
                  {userProfile.photoURL ? (
                    <img src={userProfile.photoURL} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserIcon className="w-12 h-12 text-slate-300" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-brand-black p-2.5 rounded-2xl shadow-xl border-2 border-white">
                  {userProfile.role === 'company_admin' ? (
                    <Building className="w-4 h-4 text-white" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>

              <div className="text-center lg:text-left mb-12">
                <h2 className="text-4xl font-bold text-brand-black tracking-tight mb-2">
                  {userProfile.displayName || 'Aviation Professional'}
                </h2>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-slate-400">
                  <Mail className="w-3 h-3" />
                  <span className="text-xs font-bold uppercase tracking-widest">{userProfile.email}</span>
                </div>
              </div>
              
              <nav className="w-full space-y-2">
                <TabButton 
                  active={activeTab === 'profile'} 
                  onClick={() => setActiveTab('profile')}
                  icon={<UserIcon className="w-4 h-4" />}
                  label="Professional Profile"
                />
                <TabButton 
                  active={activeTab === 'applications'} 
                  onClick={() => setActiveTab('applications')}
                  icon={<History className="w-4 h-4" />}
                  label="Application History"
                />
                <TabButton 
                  active={activeTab === 'saved'} 
                  onClick={() => setActiveTab('saved')}
                  icon={<Bookmark className="w-4 h-4" />}
                  label="Saved Opportunities"
                />
                {userProfile.role === 'company_admin' && (
                  <TabButton 
                    active={activeTab === 'company'} 
                    onClick={() => setActiveTab('company')}
                    icon={<Building className="w-4 h-4" />}
                    label="Airline Console"
                  />
                )}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="glass p-12 rounded-[3rem] min-h-[600px]">
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <motion.div 
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-16"
                  >
                    <section>
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-brand-black tracking-tight">Professional Bio</h3>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Auto-saves on blur</span>
                      </div>
                      <textarea 
                        defaultValue={userProfile.bio}
                        onBlur={(e) => handleUpdateBio(e.target.value)}
                        placeholder="Detail your aviation background, flight certifications, or technical expertise..."
                        className="w-full h-48 bg-brand-white/50 border-2 border-slate-100 rounded-[2rem] p-8 text-slate-600 placeholder:text-slate-300 focus:ring-0 focus:border-brand-black transition-all font-medium leading-relaxed"
                      />
                    </section>

                    <section>
                      <h3 className="text-2xl font-bold text-brand-black tracking-tight mb-8">Credentials & Documents</h3>
                      <div className="p-12 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-center group hover:border-brand-black transition-colors cursor-pointer">
                        <div className="bg-slate-50 p-6 rounded-[1.5rem] mb-6 group-hover:bg-brand-black group-hover:text-white transition-all">
                          <FileText className="w-8 h-8" />
                        </div>
                        <p className="text-lg font-bold text-brand-black mb-2">
                          {userProfile.resumeUrl ? 'Update Flight Resume' : 'Upload Professional CV'}
                        </p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">PDF, DOCX up to 10MB</p>
                        <button className="bg-brand-black text-white px-10 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all active:scale-95">
                          Browse Files
                        </button>
                      </div>
                    </section>
                  </motion.div>
                )}

                {activeTab === 'applications' && (
                  <motion.div 
                    key="applications"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <h3 className="text-2xl font-bold text-brand-black tracking-tight mb-12">Application Tracking</h3>
                    {applications.length > 0 ? (
                      <div className="space-y-4">
                        {applications.map((app) => (
                          <div key={app.id} className="flex items-center justify-between p-8 rounded-[2rem] bg-brand-white/50 border-2 border-transparent hover:border-slate-100 transition-all group">
                            <div className="flex items-center gap-6">
                              <div className="bg-slate-100 p-4 rounded-2xl group-hover:bg-brand-black group-hover:text-white transition-all">
                                <Plane className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-brand-black">Reference: {app.jobId.slice(0, 8).toUpperCase()}</h4>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Applied {app.appliedAt.toDate().toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
                                app.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                app.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {app.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-32">
                        <p className="text-slate-400 font-bold uppercase tracking-widest">No active applications found</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'company' && (
                  <motion.div 
                    key="company"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                    {company ? (
                      <div className="space-y-12">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-8">
                            <img src={company.logo} alt="" className="w-24 h-24 rounded-[2rem] border-4 border-white shadow-xl object-cover" />
                            <div>
                              <h3 className="text-3xl font-bold text-brand-black tracking-tight">{company.name}</h3>
                              <a href={company.website} target="_blank" className="text-xs font-bold text-brand-accent uppercase tracking-widest flex items-center gap-2 hover:underline mt-2">
                                {company.website.replace('https://', '')} <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                          <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-black transition-colors">Edit Console</button>
                        </div>

                        <section>
                          <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6">About the Carrier</h4>
                          <p className="text-slate-600 leading-relaxed font-medium text-lg">{company.description}</p>
                        </section>

                        <section>
                          <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Corporate Benefits</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {company.benefits?.map((benefit, i) => (
                              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-brand-white/50 border border-slate-100">
                                <div className="bg-emerald-100 p-2 rounded-xl">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                </div>
                                <span className="text-sm font-bold text-slate-700">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </section>
                      </div>
                    ) : (
                      <div className="text-center py-32">
                        <div className="bg-slate-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                          <Building className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-brand-black tracking-tight mb-4">No Airline Profile Linked</h3>
                        <p className="text-slate-400 mb-12 max-w-xs mx-auto font-medium">Establish your carrier's presence to start recruiting world-class aviation talent.</p>
                        <button className="bg-brand-black text-white px-12 py-5 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl shadow-brand-black/20">
                          Initialize Carrier Profile
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.15em] transition-all group ${
        active 
          ? 'bg-brand-black text-white shadow-2xl shadow-brand-black/20 translate-x-2' 
          : 'text-slate-400 hover:bg-slate-50 hover:text-brand-black'
      }`}
    >
      <span className={`${active ? 'text-brand-accent' : 'text-slate-300 group-hover:text-brand-black'} transition-colors`}>
        {icon}
      </span>
      {label}
    </button>
  );
}

function Plane({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}
