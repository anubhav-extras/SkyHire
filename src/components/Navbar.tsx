import React from 'react';
import { Plane, LogIn, LogOut, User as UserIcon, Building } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { UserProfile } from '../types';

interface NavbarProps {
  userProfile: UserProfile | null;
  onViewProfile: () => void;
}

export default function Navbar({ userProfile, onViewProfile }: NavbarProps) {
  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = () => signOut(auth);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.reload()}>
            <div className="bg-brand-black p-2 rounded-xl group-hover:scale-105 transition-transform duration-300">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-brand-black font-display">SkyHire</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-brand-black transition-all duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-brand-black hover:after:w-full after:transition-all">Find Jobs</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-brand-black transition-all duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-brand-black hover:after:w-full after:transition-all">Airlines</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-brand-black transition-all duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-brand-black hover:after:w-full after:transition-all">Career Advice</a>
            {userProfile?.role === 'company_admin' && (
              <a href="#" className="text-sm font-semibold text-brand-accent hover:opacity-80 transition-opacity flex items-center gap-2">
                <Building className="w-4 h-4" />
                Post a Job
              </a>
            )}
          </div>

          <div className="flex items-center gap-6">
            {userProfile ? (
              <div className="flex items-center gap-6">
                <button 
                  onClick={onViewProfile}
                  className="flex items-center gap-3 text-sm font-medium text-slate-600 hover:text-brand-black transition-all group"
                >
                  {userProfile.photoURL ? (
                    <img src={userProfile.photoURL} alt="" className="w-9 h-9 rounded-full border-2 border-white shadow-sm group-hover:border-brand-accent transition-colors" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                  <span className="hidden sm:inline font-semibold">{userProfile.displayName || 'Profile'}</span>
                </button>
                <button 
                  onClick={handleSignOut}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleSignIn}
                className="bg-brand-black text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all duration-300 shadow-lg shadow-black/10 flex items-center gap-2 active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
