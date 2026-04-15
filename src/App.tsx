/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, MouseEvent } from 'react';
import { UserProfile, Post } from './types';
import Sidebar from './components/Sidebar';
import About from './components/About';
import Feed from './components/Feed';
import EditProfileModal from './components/EditProfileModal';
import PullCord from './components/PullCord';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';

const initialProfile: UserProfile = {
  name: "Alex Chen",
  handle: "@alex_daily",
  subtitle: "Senior High Student 🎧",
  bio: "Welcome to my digital diary! I'm currently a high school student trying to balance exams, club activities, and my sleep schedule. When I'm not stressing over math homework, you'll probably find me listening to music, playing guitar, or hunting for the best boba in town with friends.",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80"
};

const initialPosts: Post[] = [
  {
    id: 1,
    author: "Alex Chen",
    handle: "@alex_daily",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80",
    content: "Just finished the math midterm... my brain is completely fried 🫠. Anyone want to grab boba after school? I desperately need some sugar.",
    timestamp: "2 hours ago",
    image: "https://images.unsplash.com/photo-1558857563-b371f31ca7fc?auto=format&fit=crop&w=800&q=80",
    replies: [
      {
        id: 101,
        author: "Leo (Classmate)",
        content: "Count me in! That test was brutal 😭 Meet you at the gate in 10?",
        timestamp: "1 hour ago"
      }
    ],
    reactions: { "❤️": 2, "🔥": 5 }
  },
  {
    id: 2,
    author: "Alex Chen",
    handle: "@alex_daily",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80",
    content: "Found this amazing quiet spot in the library. Perfect for exam prep. 📚✨",
    timestamp: "5 hours ago",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&h=800&q=80",
    replies: [],
    reactions: { "✨": 10 }
  },
  {
    id: 3,
    author: "Alex Chen",
    handle: "@alex_daily",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80",
    content: "Guitar practice session! 🎸 Learning some new riffs today.",
    timestamp: "Yesterday",
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80",
    replies: [],
    reactions: { "❤️": 15, "🔥": 8 }
  }
];

const CustomCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: globalThis.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div 
      className={`custom-cursor ${isHovering ? 'hovering' : ''}`}
      style={{ 
        x: mouseX,
        y: mouseY,
        translateX: '-50%',
        translateY: '-50%',
        scale: isHovering ? 2.5 : 1
      }}
    />
  );
};

const StarryBackground = ({ theme }: { theme: string }) => {
  const [stars, setStars] = useState<{ id: number; top: string; left: string; size: string; duration: string }[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const newStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1}px`,
      duration: `${Math.random() * 3 + 2}s`,
    }));
    setStars(newStars);

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="stars-container"
      style={{
        transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            '--duration': star.duration,
          } as any}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activeTab, setActiveTab] = useState<'about' | 'feed'>('about');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [wipePos, setWipePos] = useState({ x: 0, y: 0 });
  const [isWiping, setIsWiping] = useState(false);

  const handleAddPost = (content: string) => {
    const newPost: Post = {
      id: Date.now(),
      author: profile.name,
      handle: profile.handle,
      avatar: profile.avatar,
      content,
      timestamp: "Just now",
      replies: [],
      reactions: {}
    };
    setPosts([newPost, ...posts]);
  };

  const handleAddReply = (postId: number, content: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: [
            ...post.replies,
            {
              id: Date.now(),
              author: "School Friend",
              content,
              timestamp: "Just now"
            }
          ]
        };
      }
      return post;
    }));
  };

  const handleAddReaction = (postId: number, emoji: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const reactions = { ...post.reactions };
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        return { ...post, reactions };
      }
      return post;
    }));
  };

  const handleThemeToggle = (e: MouseEvent) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    
    setWipePos({ x: e.clientX, y: e.clientY });
    setIsWiping(true);
    
    setTimeout(() => {
      setTheme(nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
    }, 500); // Slightly longer delay for the liquid feel

    setTimeout(() => {
      setIsWiping(false);
    }, 1500); // Longer total duration
  };

  return (
    <div data-theme={theme} className="group bg-transparent text-slate-400 group-data-[theme=light]:text-slate-600 font-sans h-screen overflow-hidden flex flex-col md:flex-row selection:bg-accent selection:text-black transition-colors duration-500">
      <CustomCursor />
      <StarryBackground theme={theme} />
      
      {/* Grain Texture Overlay */}
      <div className="grain-overlay" />
      
      {/* Background Aura Blobs */}
      <div className="aura-blob aura-purple" />
      <div className="aura-blob aura-cyan" />
      <div className="aura-blob aura-rose" />
      
      <PullCord onPull={handleThemeToggle} theme={theme} />
      
      {/* Liquid Ripple SVG Filter Definition */}
      <svg className="liquid-filter-container">
        <defs>
          <filter id="liquid-ripple">
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.01" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" />
          </filter>
        </defs>
      </svg>

      <AnimatePresence>
        {isWiping && (
          <motion.div 
            initial={{ 
              clipPath: `circle(0% at ${wipePos.x}px ${wipePos.y}px)`,
              opacity: 1
            }}
            animate={{ 
              clipPath: `circle(150% at ${wipePos.x}px ${wipePos.y}px)`,
              opacity: 1
            }}
            exit={{ 
              opacity: 0,
              transition: { duration: 0.5 }
            }}
            transition={{ 
              duration: 1.2, 
              ease: [0.4, 0, 0.2, 1] // Custom "liquid" cubic-bezier
            }}
            className="theme-wipe"
            style={{ 
              background: theme === 'dark' ? '#f1f5f9' : '#000000',
              boxShadow: '0 0 100px rgba(0,0,0,0.5)'
            }}
          />
        )}
      </AnimatePresence>

      <Sidebar 
        profile={profile} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onEditClick={() => setIsEditModalOpen(true)}
      />
      
      <main className="flex-1 overflow-y-auto relative pb-32 md:pb-0">
        <div className="max-w-4xl mx-auto p-6 md:p-12">
          <AnimatePresence mode="wait">
            {activeTab === 'about' ? (
              <motion.div
                key="about"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
                  hidden: { opacity: 0 }
                }}
              >
                <About profile={profile} onEditClick={() => setIsEditModalOpen(true)} />
              </motion.div>
            ) : (
              <motion.div
                key="feed"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
                  hidden: { opacity: 0 }
                }}
              >
                <Feed 
                  posts={posts} 
                  onAddPost={handleAddPost} 
                  onAddReply={handleAddReply} 
                  onAddReaction={handleAddReaction}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditProfileModal 
            profile={profile} 
            onSave={(newProfile) => {
              setProfile(newProfile);
              setIsEditModalOpen(false);
            }} 
            onClose={() => setIsEditModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
