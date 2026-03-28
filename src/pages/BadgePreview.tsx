import React, { useRef } from 'react';
import { EliteBadge, ProBadge, RisingStarBadge } from '../components/Badges';
import { Download, ShieldCheck } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

export default function BadgePreview() {
  const eliteRef = useRef<HTMLDivElement>(null);
  const proRef = useRef<HTMLDivElement>(null);
  const risingStarRef = useRef<HTMLDivElement>(null);

  const downloadImage = async (ref: React.RefObject<HTMLDivElement>, name: string) => {
    if (ref.current) {
      try {
        const dataUrl = await htmlToImage.toPng(ref.current, {
          quality: 1,
          pixelRatio: 4, // High resolution
          backgroundColor: 'transparent',
        });
        const link = document.createElement('a');
        link.download = `${name}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to download image', err);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Premium Badges</h1>
        <p className="text-lg text-gray-400">Download your transparent PNG badges or preview them in dark mode.</p>
      </div>

      {/* Transparent Background Preview & Download */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Download className="w-6 h-6 text-bronze" />
          <span>Transparent PNG Export</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Elite Badge */}
          <div className="bg-bg-glass rounded-3xl p-8 shadow-sm border border-border-glass flex flex-col items-center">
            <div className="w-32 h-32 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden" style={{
              backgroundImage: 'conic-gradient(#e5e7eb 25%, white 25%, white 50%, #e5e7eb 50%, #e5e7eb 75%, white 75%, white 100%)',
              backgroundSize: '20px 20px'
            }}>
              <div ref={eliteRef} className="p-2">
                <EliteBadge className="w-16 h-16" />
              </div>
            </div>
            <h3 className="font-bold text-lg mb-1 text-white">Ultra Elite</h3>
            <p className="text-sm text-gray-400 mb-4">Rank #1</p>
            <button 
              onClick={() => downloadImage(eliteRef, 'ultra-elite-badge')}
              className="px-6 py-2 bg-gold text-gray-900 font-semibold rounded-full hover:bg-gold/90 transition-colors shadow-md flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG</span>
            </button>
          </div>

          {/* Pro Badge */}
          <div className="bg-bg-glass rounded-3xl p-8 shadow-sm border border-border-glass flex flex-col items-center">
            <div className="w-32 h-32 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden" style={{
              backgroundImage: 'conic-gradient(#e5e7eb 25%, white 25%, white 50%, #e5e7eb 50%, #e5e7eb 75%, white 75%, white 100%)',
              backgroundSize: '20px 20px'
            }}>
              <div ref={proRef} className="p-2">
                <ProBadge className="w-16 h-16" />
              </div>
            </div>
            <h3 className="font-bold text-lg mb-1 text-white">Pro</h3>
            <p className="text-sm text-gray-400 mb-4">Rank #2</p>
            <button 
              onClick={() => downloadImage(proRef, 'pro-badge')}
              className="px-6 py-2 bg-gold text-gray-900 font-semibold rounded-full hover:bg-gold/90 transition-colors shadow-md flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG</span>
            </button>
          </div>

          {/* Rising Star Badge */}
          <div className="bg-bg-glass rounded-3xl p-8 shadow-sm border border-border-glass flex flex-col items-center">
            <div className="w-32 h-32 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden" style={{
              backgroundImage: 'conic-gradient(#e5e7eb 25%, white 25%, white 50%, #e5e7eb 50%, #e5e7eb 75%, white 75%, white 100%)',
              backgroundSize: '20px 20px'
            }}>
              <div ref={risingStarRef} className="p-2">
                <RisingStarBadge className="w-16 h-16" />
              </div>
            </div>
            <h3 className="font-bold text-lg mb-1 text-white">Rising Star</h3>
            <p className="text-sm text-gray-400 mb-4">Rank #3</p>
            <button 
              onClick={() => downloadImage(risingStarRef, 'rising-star-badge')}
              className="px-6 py-2 bg-gold text-gray-900 font-semibold rounded-full hover:bg-gold/90 transition-colors shadow-md flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dark UI Preview */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <ShieldCheck className="w-6 h-6 text-bronze" />
          <span>Dark UI Preview</span>
        </h2>
        
        <div className="bg-bg-secondary rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-border-glass relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />
          
          <div className="space-y-6 relative z-10 max-w-md mx-auto">
            {/* User 1 */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-border-glass hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex items-center space-x-4">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emmanuel" alt="Emmanuel" className="w-12 h-12 rounded-full border-2 border-bg-secondary" referrerPolicy="no-referrer" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-white text-lg">Emmanuel Baraka</h3>
                    <EliteBadge className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-white/50">@emmanuel_ceo</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-gold">14,250 XP</p>
              </div>
            </div>

            {/* User 2 */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-border-glass hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex items-center space-x-4">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Sarah" className="w-12 h-12 rounded-full border-2 border-bg-secondary" referrerPolicy="no-referrer" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-white text-lg">Sarah Jenkins</h3>
                    <ProBadge className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-white/50">@sarah_j</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-blue-400">12,100 XP</p>
              </div>
            </div>

            {/* User 3 */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-border-glass hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex items-center space-x-4">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Alex" className="w-12 h-12 rounded-full border-2 border-bg-secondary" referrerPolicy="no-referrer" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-white text-lg">Alex Chen</h3>
                    <RisingStarBadge className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-white/50">@alexc_learns</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-purple-400">9,850 XP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
