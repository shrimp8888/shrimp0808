import { useState, ChangeEvent } from 'react';
import { UserProfile } from '../types';
import { X } from 'lucide-react';
import { motion } from 'motion/react';

interface EditProfileModalProps {
  profile: UserProfile;
  onSave: (newProfile: UserProfile) => void;
  onClose: () => void;
}

export default function EditProfileModal({ profile, onSave, onClose }: EditProfileModalProps) {
  const [formData, setFormData] = useState<UserProfile>(profile);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave({
      ...formData,
      name: formData.name || "User",
      handle: formData.handle || "@user",
      avatar: formData.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80"
    });
  };

  return (
    <div className="fixed inset-0 z-50 glass-modal flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="glass-card rounded-2xl w-full max-w-md shadow-2xl"
      >
        <div className="p-6 border-b border-darkborder flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Edit Profile</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Display Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-darksurface border border-darkborder rounded-xl p-3 text-white focus:outline-none focus:border-accent transition-colors" 
              placeholder="e.g. Alex Chen"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Handle / Username</label>
            <input 
              type="text" 
              name="handle"
              value={formData.handle}
              onChange={handleChange}
              className="w-full bg-darksurface border border-darkborder rounded-xl p-3 text-white focus:outline-none focus:border-accent transition-colors" 
              placeholder="e.g. @alex_daily"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Subtitle / Status</label>
            <input 
              type="text" 
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="w-full bg-darksurface border border-darkborder rounded-xl p-3 text-white focus:outline-none focus:border-accent transition-colors" 
              placeholder="e.g. Senior High Student 🎧"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Bio</label>
            <textarea 
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3} 
              className="w-full bg-darksurface border border-darkborder rounded-xl p-3 text-white focus:outline-none focus:border-accent transition-colors resize-none" 
              placeholder="Write something about yourself..."
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Avatar URL</label>
            <input 
              type="text" 
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              className="w-full bg-darksurface border border-darkborder rounded-xl p-3 text-white focus:outline-none focus:border-accent transition-colors text-sm" 
              placeholder="Paste an image URL here"
            />
          </div>
        </div>

        <div className="p-6 border-t border-darkborder flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-darksurface transition-all">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2.5 bg-accent hover:bg-accenthover text-black rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(0,242,255,0.3)]">Save Changes</button>
        </div>
      </motion.div>
    </div>
  );
}
