import { useState, MouseEvent } from 'react';
import { UserProfile } from '../types';
import { User, Layers, Facebook, Instagram, Twitter, Pencil, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  profile: UserProfile;
  activeTab: 'about' | 'feed';
  setActiveTab: (tab: 'about' | 'feed') => void;
  onEditClick: () => void;
}

export default function Sidebar({ profile, activeTab, setActiveTab, onEditClick }: SidebarProps) {
  const socialHover = {
    scale: 1.05,
    filter: 'brightness(1.2)',
    transition: { type: 'spring', stiffness: 400, damping: 10 }
  };

  return (
    <nav className="glass-nav fixed bottom-0 w-full md:relative md:w-72 md:h-screen border-t md:border-t-0 md:border-r border-darkborder z-40 flex flex-col justify-between transition-all">
      <div className="flex flex-row md:flex-col w-full">
        <div className="hidden md:flex flex-col items-center mt-10 mb-8 px-6 text-center">
          <div className="relative group cursor-pointer" onClick={onEditClick}>
            <img 
              src={profile.avatar} 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover border-2 border-darkborder group-hover:border-accent transition-all duration-300 shadow-lg"
            />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-darkbase rounded-full z-10"></div>
            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Pencil className="text-white w-6 h-6" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white dark:text-white group-data-[theme=light]:text-slate-900 mt-4 tracking-tighter">{profile.name}</h2>
          <p className="text-sm text-accent group-data-[theme=light]:text-blue-600 mt-1 font-medium">{profile.handle}</p>
        </div>

        <div className="flex flex-row md:flex-col w-full px-2 md:px-4 py-2 md:py-0 md:gap-2 justify-around">
          <button 
            onClick={() => setActiveTab('about')}
            className={`flex flex-col md:flex-row items-center justify-center md:justify-start flex-1 md:flex-none py-3 md:py-4 md:px-6 rounded-xl transition-all duration-300 ${activeTab === 'about' ? 'text-accent bg-accent/10 border border-accent/20 group-data-[theme=light]:text-blue-600 group-data-[theme=light]:bg-blue-50' : 'text-gray-400 group-data-[theme=light]:text-slate-700 hover:text-white group-data-[theme=light]:hover:text-slate-900 hover:bg-darkcard group-data-[theme=light]:hover:bg-white/60'}`}
          >
            <User className="w-5 h-5 md:mr-4 mb-1 md:mb-0" />
            <span className="text-[10px] md:text-base font-medium">About Me</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('feed')}
            className={`flex flex-col md:flex-row items-center justify-center md:justify-start flex-1 md:flex-none py-3 md:py-4 md:px-6 rounded-xl transition-all duration-300 ${activeTab === 'feed' ? 'text-violet-400 bg-violet-500/10 border border-violet-500/20 group-data-[theme=light]:text-violet-600 group-data-[theme=light]:bg-violet-50' : 'text-gray-400 group-data-[theme=light]:text-slate-700 hover:text-white group-data-[theme=light]:hover:text-slate-900 hover:bg-darkcard group-data-[theme=light]:hover:bg-white/60'}`}
          >
            <Layers className="w-5 h-5 md:mr-4 mb-1 md:mb-0" />
            <span className="text-[10px] md:text-base font-medium">Daily Feed</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col px-4 pb-4 md:pb-8 w-full">
        <div className="hidden md:block w-full h-[1px] bg-darkborder group-data-[theme=light]:bg-slate-200 mb-6"></div>
        <h4 className="hidden md:block text-xs uppercase tracking-widest text-gray-500 group-data-[theme=light]:text-slate-600 font-bold mb-4 px-2">Social Links</h4>
        
        <div className="flex flex-row md:flex-col justify-center gap-8 md:gap-1 py-3 md:py-0 border-t md:border-t-0 border-darkborder group-data-[theme=light]:border-slate-200 md:border-transparent mt-2 md:mt-0">
          <motion.a 
            whileHover={socialHover}
            href="https://facebook.com" target="_blank" rel="noreferrer" className="flex items-center gap-4 md:p-3 rounded-xl hover:bg-darkcard group-data-[theme=light]:hover:bg-white/60 border border-transparent hover:border-darkborder group-data-[theme=light]:hover:border-slate-200 text-gray-400 group-data-[theme=light]:text-slate-700 hover:text-blue-500 transition-all group/social"
          >
            <Facebook className="w-6 h-6 md:w-5 md:h-5 group-hover/social:scale-110 transition-transform" />
            <span className="hidden md:inline text-sm font-medium">Facebook</span>
          </motion.a>
          <motion.a 
            whileHover={socialHover}
            href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-4 md:p-3 rounded-xl hover:bg-darkcard group-data-[theme=light]:hover:bg-white/60 border border-transparent hover:border-darkborder group-data-[theme=light]:hover:border-slate-200 text-gray-400 group-data-[theme=light]:text-slate-700 hover:text-pink-500 transition-all group/social"
          >
            <Instagram className="w-6 h-6 md:w-5 md:h-5 group-hover/social:scale-110 transition-transform" />
            <span className="hidden md:inline text-sm font-medium">Instagram</span>
          </motion.a>
          <motion.a 
            whileHover={socialHover}
            href="https://twitter.com" target="_blank" rel="noreferrer" className="flex items-center gap-4 md:p-3 rounded-xl hover:bg-darkcard group-data-[theme=light]:hover:bg-white/60 border border-transparent hover:border-darkborder group-data-[theme=light]:hover:border-slate-200 text-gray-400 group-data-[theme=light]:text-slate-700 hover:text-slate-900 transition-all group/social"
          >
            <Twitter className="w-6 h-6 md:w-5 md:h-5 group-hover/social:scale-110 transition-transform" />
            <span className="hidden md:inline text-sm font-medium">X</span>
          </motion.a>
        </div>
      </div>
    </nav>
  );
}
