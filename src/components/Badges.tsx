import React from 'react';
import { Check, Star } from 'lucide-react';

export const EliteBadge = ({ className = "w-5 h-5" }: { className?: string }) => (
  <div 
    className={`relative flex items-center justify-center rounded-full bg-gradient-to-b from-[#FFDF73] to-[#E5B01A] shadow-[0_2px_10px_rgba(229,176,26,0.6),inset_0_1px_1px_rgba(255,255,255,0.8)] border border-[#B38500] ${className}`} 
    title="Ultra Elite (Rank #1)"
  >
    <Check className="w-[60%] h-[60%] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]" strokeWidth={4} />
  </div>
);

export const ProBadge = ({ className = "w-5 h-5" }: { className?: string }) => (
  <div 
    className={`relative flex items-center justify-center rounded-full bg-gradient-to-b from-[#60A5FA] to-[#2563EB] shadow-[0_2px_10px_rgba(37,99,235,0.6),inset_0_1px_1px_rgba(255,255,255,0.6)] border border-[#1D4ED8] ${className}`} 
    title="Pro (Rank #2)"
  >
    <Check className="w-[60%] h-[60%] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]" strokeWidth={4} />
  </div>
);

export const RisingStarBadge = ({ className = "w-5 h-5" }: { className?: string }) => (
  <div 
    className={`relative flex items-center justify-center rounded-full bg-gradient-to-b from-[#E879F9] to-[#C026D3] shadow-[0_2px_10px_rgba(192,38,211,0.6),inset_0_1px_1px_rgba(255,255,255,0.6)] border border-[#A21CAF] ${className}`} 
    title="Rising Star (Rank #3)"
  >
    <Star className="w-[55%] h-[55%] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] fill-white" strokeWidth={1.5} />
  </div>
);
