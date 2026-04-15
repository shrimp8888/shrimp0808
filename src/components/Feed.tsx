import { useState, useRef, MouseEvent } from 'react';
import { Post } from '../types';
import { MessageSquare } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface FeedProps {
  posts: Post[];
  onAddPost: (content: string) => void;
  onAddReply: (postId: number, content: string) => void;
  onAddReaction: (postId: number, emoji: string) => void;
}

export default function Feed({ posts, onAddPost, onAddReply, onAddReaction }: FeedProps) {
  const [newPostContent, setNewPostContent] = useState('');
  const [replyContents, setReplyContents] = useState<Record<number, string>>({});
  const [openReplyBoxes, setOpenReplyBoxes] = useState<Record<number, boolean>>({});

  // Magnetic Button Logic
  const buttonRef = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Limit the movement range
    x.set(distanceX * 0.35);
    y.set(distanceY * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handlePostSubmit = () => {
    if (newPostContent.trim()) {
      onAddPost(newPostContent.trim());
      setNewPostContent('');
    }
  };

  const handleReplySubmit = (postId: number) => {
    const content = replyContents[postId]?.trim();
    if (content) {
      onAddReply(postId, content);
      setReplyContents(prev => ({ ...prev, [postId]: '' }));
    }
  };

  const toggleReplyBox = (postId: number) => {
    setOpenReplyBoxes(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const cardHover = {
    scale: 1.05,
    filter: 'brightness(1.2)',
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  };

  const emojiVariants = {
    initial: { scale: 1 },
    tap: { scale: 1.5, rotate: [0, 10, -10, 0] },
    hover: { scale: 1.2 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } }
      }}
    >
      <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 mb-8 shadow-lg">
        <h2 className="text-xl font-bold text-white group-data-[theme=light]:text-slate-900 mb-4 tracking-tighter">Share an Update</h2>
        <textarea 
          rows={3} 
          className="w-full bg-darksurface/50 group-data-[theme=light]:bg-white/50 border border-darkborder group-data-[theme=light]:border-slate-300 rounded-xl p-4 text-white group-data-[theme=light]:text-slate-900 placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none" 
          placeholder="How was school today?"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <motion.button 
            ref={buttonRef}
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handlePostSubmit}
            className="bg-accent group-data-[theme=light]:bg-blue-600 hover:bg-accenthover group-data-[theme=light]:hover:bg-blue-700 text-black group-data-[theme=light]:text-white font-bold py-2.5 px-6 rounded-xl transition-colors duration-300 shadow-[0_0_15px_rgba(0,242,255,0.3)] relative z-10"
          >
            Post
          </motion.button>
        </div>
      </motion.div>

      <div className="masonry-grid">
        {posts.length === 0 ? (
          <p className="text-gray-500 group-data-[theme=light]:text-slate-600 text-center py-10 w-full">No updates yet. Be the first to post!</p>
        ) : (
          posts.map((post) => (
            <motion.div 
              key={post.id}
              variants={itemVariants}
              className="masonry-item glass-card rounded-2xl p-6 shadow-lg cursor-default overflow-hidden group/card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.img 
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    src={post.avatar} 
                    alt="Avatar" 
                    className="w-10 h-10 rounded-full object-cover border border-darkborder group-data-[theme=light]:border-slate-200 shadow-sm" 
                  />
                  <div>
                    <h4 className="text-white group-data-[theme=light]:text-slate-900 font-bold leading-tight tracking-tight">{post.author}</h4>
                    <span className="text-accent group-data-[theme=light]:text-blue-600 text-xs">{post.handle} • {post.timestamp}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-200 group-data-[theme=light]:text-slate-800 text-base leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>
              
              {post.image && (
                <div className="relative mb-4 rounded-xl overflow-hidden group/image">
                  <img 
                    src={post.image} 
                    alt="Post content" 
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover/image:scale-110" 
                  />
                  {/* Glassmorphism Overlay */}
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover/image:opacity-100 transition-opacity duration-500 flex items-center justify-center p-6">
                    <div className="glass-card p-4 rounded-xl border-white/20 transform translate-y-4 group-hover/image:translate-y-0 transition-transform duration-500">
                      <p className="text-white text-xs font-bold tracking-widest uppercase mb-1">View Details</p>
                      <p className="text-slate-300 group-data-[theme=light]:text-slate-700 text-[10px] leading-tight">Captured with passion. Tap to expand and see more about this moment.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 border-t border-darkborder group-data-[theme=light]:border-slate-200 pt-4">
                <div className="flex items-center gap-2 bg-darksurface/50 group-data-[theme=light]:bg-slate-100 p-1 rounded-full border border-darkborder group-data-[theme=light]:border-slate-200">
                  {[
                    { emoji: '❤️', color: 'hover:bg-rose-500/20 text-rose-500', badge: 'bg-rose-500' },
                    { emoji: '🔥', color: 'hover:bg-orange-500/20 text-orange-500', badge: 'bg-orange-500' },
                    { emoji: '😂', color: 'hover:bg-amber-500/20 text-amber-500', badge: 'bg-amber-500' }
                  ].map(item => (
                    <motion.button
                      key={item.emoji}
                      variants={emojiVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => onAddReaction(post.id, item.emoji)}
                      className={`w-8 h-8 flex items-center justify-center text-lg rounded-full transition-colors relative ${item.color}`}
                    >
                      {item.emoji}
                      {post.reactions?.[item.emoji] && (
                        <span className={`absolute -top-1 -right-1 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm ${item.badge}`}>
                          {post.reactions[item.emoji]}
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>

                <button 
                  className="flex items-center gap-2 text-gray-400 group-data-[theme=light]:text-slate-600 hover:text-accent group-data-[theme=light]:hover:text-blue-600 transition-colors text-sm font-medium ml-auto"
                  onClick={() => toggleReplyBox(post.id)}
                >
                  <MessageSquare className="w-4 h-4" /> Reply ({post.replies.length})
                </button>
              </div>

              {post.replies.length > 0 && (
                <div className="mt-4 space-y-3 pl-4 border-l-2 border-darkborder group-data-[theme=light]:border-slate-200">
                  {post.replies.map(reply => (
                    <motion.div 
                      key={reply.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-darksurface group-data-[theme=light]:bg-slate-50 p-4 rounded-xl border border-darkborder group-data-[theme=light]:border-slate-200"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-gray-200 group-data-[theme=light]:text-slate-900">{reply.author}</span>
                        <span className="text-xs text-gray-500 group-data-[theme=light]:text-slate-400">{reply.timestamp}</span>
                      </div>
                      <p className="text-gray-300 group-data-[theme=light]:text-slate-700 text-sm">{reply.content}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {openReplyBoxes[post.id] && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 flex gap-3"
                >
                  <input 
                    type="text" 
                    className="flex-1 bg-darksurface group-data-[theme=light]:bg-slate-50 border border-darkborder group-data-[theme=light]:border-slate-300 rounded-xl px-4 py-2 text-sm text-white group-data-[theme=light]:text-slate-900 focus:outline-none focus:border-accent transition-colors" 
                    placeholder="Write a reply..."
                    value={replyContents[post.id] || ''}
                    onChange={(e) => setReplyContents(prev => ({ ...prev, [post.id]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleReplySubmit(post.id);
                    }}
                  />
                  <button 
                    onClick={() => handleReplySubmit(post.id)}
                    className="bg-darkborder group-data-[theme=light]:bg-slate-200 hover:bg-accent group-data-[theme=light]:hover:bg-blue-600 hover:text-black group-data-[theme=light]:hover:text-white text-white group-data-[theme=light]:text-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300"
                  >
                    Send
                  </button>
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
