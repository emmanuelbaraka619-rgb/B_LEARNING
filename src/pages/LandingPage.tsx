import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { signInWithGoogle } from '../firebase';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Brain, Trophy } from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to sign in', error);
    }
  };

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-secondary text-white overflow-hidden relative flex flex-col items-center justify-center">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-bronze/20 rounded-full blur-[100px] opacity-40 pointer-events-none" />

      <main className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 inline-flex items-center space-x-2 bg-white/5 border border-border-glass rounded-full px-4 py-2 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4 text-gold" />
          <span className="text-sm font-medium tracking-wide text-white uppercase">The Future of Education</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-6"
        >
          TAKE TIME TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-bronze">IMPROVE</span>
          <br />
          DON'T TAKE TIME TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-bronze to-gold">PROVE</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="text-lg md:text-2xl text-white max-w-2xl mx-auto mb-12 font-light"
        >
          B_LEARNING turns your messy notes into professional summaries, interactive flashcards, and gamified quizzes in seconds.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          onClick={handleSignIn}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-gray-900 bg-gold rounded-full overflow-hidden shadow-[0_0_40px_rgba(255,193,7,0.4)] hover:shadow-[0_0_60px_rgba(255,193,7,0.6)] transition-all"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-gold via-yellow-400 to-bronze opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" />
          <span className="relative flex items-center space-x-2">
            <span>Continue with Google</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto w-full"
        >
          {[
            { icon: Brain, title: "AI Summaries", desc: "Instantly distill complex notes into key takeaways." },
            { icon: Sparkles, title: "Smart Flashcards", desc: "Master concepts with auto-generated study cards." },
            { icon: Trophy, title: "Gamified Quizzes", desc: "Earn XP and climb the leaderboard as you learn." }
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-border-glass backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-white">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
