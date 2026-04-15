import { useState, MouseEvent } from 'react';
import { motion, useAnimation } from 'motion/react';

interface PullCordProps {
  onPull: (e: MouseEvent) => void;
  theme: 'dark' | 'light';
}

export default function PullCord({ onPull, theme }: PullCordProps) {
  const controls = useAnimation();
  const [isPulling, setIsPulling] = useState(false);

  const handlePull = async (e: MouseEvent) => {
    if (isPulling) return;
    setIsPulling(true);

    // Physics-based tug animation
    await controls.start({
      y: 40,
      transition: { type: 'spring', stiffness: 600, damping: 15 }
    });

    // Trigger theme change
    onPull(e);

    // Visual feedback "flash"
    controls.start({
      filter: ["brightness(1)", "brightness(2)", "brightness(1)"],
      transition: { duration: 0.2 }
    });

    // Swinging rebound animation
    await controls.start({
      y: 0,
      rotate: [0, 10, -8, 5, -3, 0],
      transition: { 
        y: { type: 'spring', stiffness: 300, damping: 10 },
        rotate: { duration: 1.5, ease: "easeOut" }
      }
    });

    setIsPulling(false);
  };

  return (
    <div className="fixed top-0 right-8 md:right-16 z-[100] pointer-events-none">
      <motion.div 
        animate={controls}
        className="flex flex-col items-center origin-top pointer-events-auto cursor-pointer group"
        onClick={handlePull}
      >
        {/* The String */}
        <div className="w-[2px] h-32 md:h-48 bg-gradient-to-b from-gray-400 to-gray-600 group-hover:from-accent group-hover:to-accent transition-colors duration-300 shadow-sm" />
        
        {/* The Handle */}
        <div className="relative -mt-1">
          {/* Handle Body */}
          <div className="w-6 h-10 md:w-8 md:h-12 bg-gradient-to-br from-gray-200 to-gray-400 group-data-[theme=light]:from-slate-700 group-data-[theme=light]:to-slate-900 rounded-full shadow-xl border border-gray-400 group-data-[theme=light]:border-slate-600 transition-all duration-300 group-hover:scale-110 group-active:scale-95" />
          
          {/* Handle Detail (Grip) */}
          <div className="absolute inset-x-1 top-1/4 bottom-1/4 flex flex-col justify-between px-1 opacity-40">
            <div className="h-[1px] bg-black" />
            <div className="h-[1px] bg-black" />
            <div className="h-[1px] bg-black" />
          </div>

          {/* Glow effect when hovering */}
          <div className="absolute inset-0 rounded-full bg-accent/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Tooltip */}
        <div className="absolute top-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <span className="px-3 py-1 bg-black/80 text-accent text-[10px] font-bold tracking-widest rounded-full whitespace-nowrap border border-accent/30">
            PULL TO {theme === 'dark' ? 'DAWN' : 'DUSK'}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
