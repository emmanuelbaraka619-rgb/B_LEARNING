import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { doc, updateDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { User, Settings, Medal, BookOpen, Clock, Edit2, Check, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface PastNote {
  id: string;
  createdAt: string;
  summary: string;
}

export default function Profile() {
  const { user, userData, refreshUserData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(userData?.bio || '');
  const [displayName, setDisplayName] = useState(userData?.displayName || '');
  const [pastNotes, setPastNotes] = useState<PastNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      setBio(userData.bio);
      setDisplayName(userData.displayName);
    }
  }, [userData]);

  useEffect(() => {
    const fetchPastNotes = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, 'notes'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const notes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PastNote));
        setPastNotes(notes);
      } catch (error) {
        console.error("Error fetching past notes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPastNotes();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        bio,
        displayName
      });
      await refreshUserData();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!userData) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-bg-glass rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border-glass text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gold/20 to-transparent" />
            <div className="relative z-10">
              <img 
                src={userData.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.displayName}`} 
                alt={userData.displayName} 
                className="w-32 h-32 mx-auto rounded-full border-4 border-white shadow-xl mb-6"
              />
              
              {isEditing ? (
                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Name</label>
                    <input 
                      type="text" 
                      value={displayName} 
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-border-glass focus:ring-2 focus:ring-gold focus:border-transparent bg-bg-glass"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Bio</label>
                    <textarea 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-border-glass focus:ring-2 focus:ring-gold focus:border-transparent bg-bg-glass resize-none h-24"
                    />
                  </div>
                  <button 
                    onClick={handleSave}
                    className="w-full flex items-center justify-center space-x-2 bg-bg-secondary text-white px-4 py-2 rounded-xl font-bold hover:bg-bg-secondary/90 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Profile</span>
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-white mb-1">{userData.displayName}</h2>
                  <p className="text-sm text-gray-400 mb-6">{userData.email}</p>
                  <p className="text-white italic mb-8">"{userData.bio}"</p>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-bg-main text-white border border-border-glass px-4 py-2 rounded-xl font-bold hover:bg-gold/10 hover:border-gold/30 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>

          {/* Stats Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-bg-glass rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border-glass"
          >
            <h3 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
              <Medal className="w-5 h-5 text-gold" />
              <span>Achievements</span>
            </h3>
            
            <div className="flex items-center justify-between p-4 bg-gold/5 rounded-2xl border border-gold/20 mb-6">
              <span className="font-bold text-gray-400">Total XP</span>
              <span className="text-3xl font-black text-bronze">{userData.xp.toLocaleString()}</span>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Badges Earned</h4>
              <div className="flex flex-wrap gap-2">
                {userData.badges.map((badge, i) => (
                  <div key={i} className="flex items-center space-x-1.5 bg-bg-main border border-border-glass px-3 py-1.5 rounded-full text-sm font-medium text-white shadow-sm">
                    <Star className="w-4 h-4 text-gold" />
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-bg-glass rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border-glass min-h-[600px]"
          >
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-border-glass">
              <h3 className="text-2xl font-black text-white flex items-center space-x-3">
                <BookOpen className="w-6 h-6 text-bronze" />
                <span>Learning History</span>
              </h3>
              <span className="text-sm font-bold text-gray-400 bg-bg-main px-3 py-1 rounded-full">
                {pastNotes.length} Uploads
              </span>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
              </div>
            ) : pastNotes.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center">
                <div className="w-20 h-20 bg-bg-main rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="w-10 h-10 text-gray-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">No notes yet</h4>
                <p className="text-gray-400 max-w-sm">Head over to the Hub to upload your first set of notes and start earning XP!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pastNotes.map((note) => (
                  <div key={note.id} className="group p-6 rounded-2xl border border-border-glass bg-bg-glass hover:bg-bg-glass hover:border-gold/30 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 text-sm font-bold text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(note.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                    <p className="text-white line-clamp-3 text-sm leading-relaxed">
                      {note.summary.replace(/[#*`]/g, '')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
