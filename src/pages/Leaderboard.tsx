import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Trophy, Star, Flame, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { EliteBadge, ProBadge, RisingStarBadge } from '../components/Badges';

interface LeaderboardUser {
  uid: string;
  displayName: string;
  photoURL: string;
  xp: number;
  badges: string[];
}

export default function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('xp', 'desc'), limit(50));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => doc.data() as LeaderboardUser);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/20 mb-6"
        >
          <Trophy className="w-10 h-10 text-gold" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Global Leaderboard</h1>
        <p className="text-lg text-gray-400">Compete, learn, and earn your place among the elite.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Dark UI Preview for Top 3 */}
          {top3.length > 0 && (
            <div className="mb-12 bg-bg-secondary rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-border-glass relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-gold/10 via-transparent to-transparent opacity-50 pointer-events-none" />
              
              <h2 className="text-2xl font-black text-white mb-10 text-center flex items-center justify-center space-x-3 relative z-10">
                <Award className="w-7 h-7 text-gold" />
                <span>Hall of Fame</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {top3.map((user, index) => {
                  const rankColor = index === 0 ? 'text-yellow-400' : index === 1 ? 'text-blue-400' : 'text-purple-400';
                  const rankBg = index === 0 ? 'bg-yellow-400/5 border-yellow-400/20' : index === 1 ? 'bg-blue-400/5 border-blue-400/20' : 'bg-purple-400/5 border-purple-400/20';

                  return (
                    <motion.div 
                      key={user.uid}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex flex-col items-center p-8 rounded-3xl border backdrop-blur-md ${rankBg} hover:bg-white/5 transition-colors`}
                    >
                      <div className="relative mb-5">
                        <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.displayName}`} alt={user.displayName} className="w-24 h-24 rounded-full border-4 border-bg-secondary shadow-xl object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute -bottom-2 -right-2 bg-bg-secondary rounded-full p-1.5 shadow-lg">
                          {index === 0 && <EliteBadge className="w-7 h-7" />}
                          {index === 1 && <ProBadge className="w-7 h-7" />}
                          {index === 2 && <RisingStarBadge className="w-7 h-7" />}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-bold text-xl text-white tracking-tight">{user.displayName}</h3>
                        {index === 0 && <EliteBadge className="w-5 h-5" />}
                        {index === 1 && <ProBadge className="w-5 h-5" />}
                        {index === 2 && <RisingStarBadge className="w-5 h-5" />}
                      </div>
                      
                      <div className={`text-xs font-black ${rankColor} uppercase tracking-widest mb-4`}>
                        Rank #{index + 1}
                      </div>
                      
                      <div className="flex items-center space-x-1.5 bg-white/10 px-4 py-2 rounded-full border border-border-glass shadow-inner">
                        <Flame className="w-4 h-4 text-bronze" />
                        <span className="font-bold text-white">{user.xp.toLocaleString()} XP</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rest of the Leaderboard */}
          {rest.length > 0 && (
            <div className="bg-bg-glass rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border-glass overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-6 border-b border-border-glass bg-bg-glass text-sm font-bold text-gray-400 uppercase tracking-wider">
                <div className="col-span-2 md:col-span-1 text-center">Rank</div>
                <div className="col-span-7 md:col-span-5">Learner</div>
                <div className="col-span-3 md:col-span-2 text-right">XP</div>
                <div className="hidden md:block col-span-4 text-right">Badges</div>
              </div>

              <div className="divide-y divide-border-glass">
                {rest.map((user, index) => (
                  <motion.div
                    key={user.uid}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="grid grid-cols-12 gap-4 p-6 items-center transition-colors hover:bg-bg-glass"
                  >
                    <div className="col-span-2 md:col-span-1 flex justify-center">
                      <span className="text-xl font-bold text-gray-400">{index + 4}</span>
                    </div>
                    
                    <div className="col-span-7 md:col-span-5 flex items-center space-x-4">
                      <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.displayName}`} alt={user.displayName} className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <h3 className="font-bold text-white">{user.displayName}</h3>
                      </div>
                    </div>

                    <div className="col-span-3 md:col-span-2 flex items-center justify-end space-x-1">
                      <Flame className="w-4 h-4 text-bronze" />
                      <span className="font-black text-lg text-white">{user.xp.toLocaleString()}</span>
                    </div>

                    <div className="hidden md:flex col-span-4 justify-end items-center space-x-2">
                      {user.badges.slice(0, 3).map((badge, i) => (
                        <div key={i} className="flex items-center space-x-1 bg-bg-glass border border-border-glass px-2 py-1 rounded-full text-xs font-medium text-gray-400 shadow-sm">
                          <Star className="w-3 h-3 text-gold" />
                          <span>{badge}</span>
                        </div>
                      ))}
                      {user.badges.length > 3 && (
                        <span className="text-xs font-bold text-gray-400">+{user.badges.length - 3}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
