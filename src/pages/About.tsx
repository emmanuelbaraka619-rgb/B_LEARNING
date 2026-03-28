import React from 'react';
import { motion } from 'motion/react';
import { Mail, Globe, Sparkles, Instagram, Facebook } from 'lucide-react';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function About() {
  return (
    <div className="min-h-screen bg-bg-main text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gold/20 rounded-3xl blur-3xl transform -rotate-6 scale-105" />
            <div className="relative bg-bg-secondary rounded-3xl p-8 md:p-12 text-white shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-bronze/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-sm border border-border-glass">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="text-sm font-bold tracking-widest uppercase text-gold">The Visionary</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">
                Emmanuel<br />Baraka
              </h1>
              
              <p className="text-xl text-white font-light mb-8">
                Founder, Developer & CEO of <span className="font-bold text-gold">B_LEARNING</span>
              </p>
              
              <div className="space-y-6 text-lg text-white leading-relaxed">
                <p>
                  "A student who likes to bring dreams into reality."
                </p>
                <p>
                  Emmanuel recognized that traditional studying was broken—too much time spent organizing, not enough time mastering. B_LEARNING was born from the desire to leverage AI to democratize elite-level education.
                </p>
                <p>
                  By turning raw notes into structured summaries, interactive flashcards, and gamified quizzes, Emmanuel is building a platform that doesn't just help students pass exams, but helps them master concepts and enjoy the process.
                </p>
              </div>

              <div className="mt-12 flex items-center space-x-6">
                <a href="mailto:emmanuelbaraka619@gmail.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gold transition-colors" title="Email">
                  <Mail className="w-6 h-6" />
                </a>
                <a href="https://www.instagram.com/emmanuelbaraka_official/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gold transition-colors" title="Instagram">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="https://www.tiktok.com/@emmanuelbaraka_official" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gold transition-colors" title="TikTok">
                  <TikTokIcon className="w-6 h-6" />
                </a>
                <a href="https://www.facebook.com/profile.php?id=61583849205532" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gold transition-colors" title="Facebook">
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="bg-bg-glass rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border-glass">
              <h3 className="text-2xl font-black text-white mb-4">The Mission</h3>
              <p className="text-gray-400 leading-relaxed">
                To create a world where learning is frictionless, engaging, and accessible to everyone. We believe that with the right tools, any student can achieve mastery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gold/10 rounded-3xl p-8 border border-gold/20">
                <h4 className="text-4xl font-black text-bronze mb-2">10x</h4>
                <p className="font-bold text-white">Faster Learning</p>
                <p className="text-sm text-gray-400 mt-2">Skip the formatting, jump straight to understanding.</p>
              </div>
              <div className="bg-bronze/10 rounded-3xl p-8 border border-bronze/20">
                <h4 className="text-4xl font-black text-gold mb-2">∞</h4>
                <p className="font-bold text-white">Possibilities</p>
                <p className="text-sm text-gray-400 mt-2">Any subject, any language, any level of complexity.</p>
              </div>
            </div>

            <div className="bg-bg-glass rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border-glass flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white mb-1">Join the Revolution</h4>
                <p className="text-sm text-gray-400">Start learning smarter today.</p>
              </div>
              <Globe className="w-10 h-10 text-gold opacity-50" />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
