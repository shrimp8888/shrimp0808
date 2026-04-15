import { UserProfile } from '../types';
import { Camera, Music, Book, Coffee, Heart, Star, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

interface AboutProps {
  profile: UserProfile;
  onEditClick: () => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export default function About({ profile, onEditClick }: AboutProps) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 5]);

  return (
    <div ref={containerRef} className="bento-grid w-full">
      {/* Main Profile Tile (Col 1-2, Row 1-2) */}
      <motion.div 
        variants={itemVariants}
        className="col-span-1 md:col-span-2 row-span-1 md:row-span-2 glass-card glass-card-cyan rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-10 blur-3xl rounded-full" />
        
        <motion.div 
          style={{ y: y1, rotate: rotate1 }}
          className="relative mb-6 cursor-pointer" 
          onClick={onEditClick}
        >
          <img 
            src={profile.avatar} 
            alt="Profile" 
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white/10 shadow-2xl group-hover:border-accent transition-colors duration-500"
          />
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Camera className="text-white w-8 h-8" />
          </div>
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-bold text-white group-data-[theme=light]:text-slate-900 tracking-tighter mb-2">
          {profile.name}
        </h1>
        <p className="text-accent font-medium tracking-wide">{profile.handle}</p>
        <p className="text-slate-400 group-data-[theme=light]:text-slate-600 mt-2 text-sm">{profile.subtitle}</p>
      </motion.div>

      {/* Bio Tile (Col 3-4, Row 1) */}
      <motion.div 
        variants={itemVariants}
        className="col-span-1 md:col-span-2 glass-card glass-card-violet rounded-3xl p-8 flex flex-col justify-center"
      >
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 group-data-[theme=light]:text-slate-700 mb-4 flex items-center gap-2">
          <Sparkles className="w-3 h-3" /> About Me
        </h4>
        <p className="text-slate-300 group-data-[theme=light]:text-slate-800 leading-relaxed text-sm md:text-base">
          {profile.bio}
        </p>
      </motion.div>

      {/* Vibe Tile (Col 3, Row 2) */}
      <motion.div 
        variants={itemVariants}
        className="col-span-1 glass-card glass-card-rose rounded-3xl p-6 flex flex-col justify-between"
      >
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 group-data-[theme=light]:text-slate-700 mb-4">My Vibe</h4>
        <div className="flex flex-wrap gap-2">
          {[
            { emoji: '🎸', color: 'bg-rose-500/20 border-rose-500/30 text-rose-400' },
            { emoji: '🎧', color: 'bg-violet-500/20 border-violet-500/30 text-violet-400' },
            { emoji: '🧋', color: 'bg-amber-500/20 border-amber-500/30 text-amber-400' },
            { emoji: '📝', color: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' }
          ].map((item, i) => (
            <span 
              key={i} 
              className={`w-10 h-10 flex items-center justify-center rounded-xl text-xl border animate-breathing ${item.color}`}
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              {item.emoji}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Stats Tile (Col 4, Row 2) */}
      <motion.div 
        variants={itemVariants}
        className="col-span-1 glass-card glass-card-amber rounded-3xl p-6 flex flex-col justify-between"
      >
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 group-data-[theme=light]:text-slate-700 mb-4">Stats</h4>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400 group-data-[theme=light]:text-slate-600">Coffee Intake</span>
              <span className="text-[10px] font-mono text-amber-400">85%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "85%" }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]" 
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400 group-data-[theme=light]:text-slate-600">Sleep Quality</span>
              <span className="text-[10px] font-mono text-emerald-400">40%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "40%" }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.7 }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
