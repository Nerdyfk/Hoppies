import React, { useState, useRef } from 'react';
import { Sparkles, ArrowRight, Layers, Zap } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { FEATURED_NFTS, BunInkNFT } from '../data/mockData.ts';

interface HeroProps {
  onJoinClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onJoinClick }) => {
  const [selectedNFT, setSelectedNFT] = useState<BunInkNFT>(FEATURED_NFTS[0]);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Subtle differential parallax rates
  const yLeft = useTransform(scrollYProgress, [0, 1], [0, -32]);
  const yRight = useTransform(scrollYProgress, [0, 1], [0, -55]);
  const yGlow = useTransform(scrollYProgress, [0, 1], [0, 35]);
  const opacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 0.95, 0.75]);

  return (
    <section ref={sectionRef} className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 overflow-hidden">
      {/* Subtle parallax ambient glow orb */}
      <motion.div
        style={{ y: yGlow }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-purple-600/10 dark:bg-purple-600/20 blur-[100px] rounded-full pointer-events-none -z-10"
      />

      <motion.div style={{ opacity }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & CTA (subtle upward parallax) */}
          <motion.div style={{ y: yLeft }} className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline */}
            <p className="font-cooper text-purple-700 text-lg sm:text-xl tracking-normal">
              Small Bunnies. Big Stories. 🐰
            </p>

            {/* Main Headline */}
            <h1 className="font-cooper text-4xl sm:text-6xl lg:text-7xl font-normal text-slate-900 tracking-tight leading-[1.16]">
              Join The Official <br />
              <span className="relative inline-block text-purple-700 select-none mr-3">
                <span className="relative z-10">BunInk</span>
                {/* SVG Liquid Drip Path */}
                <svg
                  className="absolute left-0 -bottom-3 sm:-bottom-3.5 w-full overflow-visible pointer-events-none text-purple-700 animate-drip-sway z-10"
                  viewBox="0 0 200 28"
                  fill="currentColor"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M 0,0 Q 10,0 14,8 Q 18,18 22,18 Q 26,18 30,8 Q 34,0 45,0 Q 55,0 60,12 Q 66,26 72,26 Q 78,26 84,12 Q 88,0 100,0 Q 110,0 115,10 Q 120,20 125,20 Q 130,20 135,10 Q 140,0 152,0 Q 160,0 166,14 Q 172,28 178,28 Q 184,28 190,14 Q 194,0 200,0 Z" />
                </svg>
                {/* Animated Falling Droplets */}
                <span className="absolute left-[11%] -bottom-4 w-1.5 h-2 rounded-full bg-purple-700 animate-ink-drop-3 pointer-events-none" />
                <span className="absolute left-[36%] -bottom-5 w-2 h-2.5 rounded-full bg-purple-700 animate-ink-drop-1 pointer-events-none" />
                <span className="absolute left-[89%] -bottom-5 w-2 h-2.5 rounded-full bg-purple-700 animate-ink-drop-2 pointer-events-none" />
              </span>
              <span className="relative inline-block">
                <span>Whitelist</span>
                {/* Secondary subtle drip accent */}
                <svg
                  className="absolute left-0 -bottom-2 w-full h-3 overflow-visible pointer-events-none text-slate-900/80 animate-drip-sway z-10"
                  viewBox="0 0 160 14"
                  fill="currentColor"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M 0,0 Q 12,0 18,6 Q 22,12 26,12 Q 30,12 34,6 Q 40,0 52,0 Q 64,0 70,8 Q 74,14 78,14 Q 82,14 86,8 Q 92,0 106,0 Q 116,0 122,5 Q 126,10 130,10 Q 134,10 138,5 Q 144,0 160,0 Z" />
                </svg>
                <span className="absolute left-[49%] -bottom-3.5 w-1.5 h-2 rounded-full bg-slate-900/80 animate-ink-drop-2 pointer-events-none" />
              </span>
            </h1>

            {/* Paragraph */}
            <p className="text-slate-700 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              <strong className="text-slate-900 font-semibold">BunInk</strong> is a playful collection of unique digital bunnies on Inkonchain L2, each with its own personality, style, and story. From colorful outfits and quirky accessories to rare expressions and unexpected traits, every BunInk is one of a kind.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onJoinClick}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-cooper text-base tracking-wide transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>Join Whitelist Now</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto lg:mx-0 text-left">
              <div className="p-3.5 rounded-xl bg-white/80 border border-amber-200/80 shadow-xs">
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Supply</p>
                <p className="text-base sm:text-xl font-bold text-slate-900 font-cooper mt-0.5">2,222</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/80 border border-amber-200/80 shadow-xs">
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Traits</p>
                <p className="text-base sm:text-xl font-bold text-purple-700 font-cooper mt-0.5">200+</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/80 border border-amber-200/80 shadow-xs">
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Mint Date</p>
                <p className="text-base sm:text-xl font-bold text-sky-600 font-cooper mt-0.5">TBA</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/80 border border-amber-200/80 shadow-xs">
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Mint Price</p>
                <p className="text-base sm:text-xl font-bold text-emerald-600 font-cooper mt-0.5">TBA</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Clean NFT Card Showcase (floating differential parallax) */}
          <motion.div style={{ y: yRight }} className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-sm rounded-2xl bg-white border-2 border-amber-300/80 shadow-xl shadow-amber-900/10 overflow-hidden">
              {/* Card Image Area */}
              <div className="relative aspect-square w-full bg-[#FEF3C7] overflow-hidden border-b border-amber-200/80">
                <img
                  src={selectedNFT.image}
                  alt={selectedNFT.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* Card Info Details */}
              <div className="p-5 space-y-4 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-cooper">
                      {selectedNFT.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Inkonchain Genesis Collection
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-purple-100 text-purple-700 border border-purple-200">
                    ERC-721
                  </span>
                </div>

                {/* Traits preview grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/80">
                    <span className="text-[10px] text-slate-500 uppercase font-medium block">Chain</span>
                    <span className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
                      <Zap className="w-3 h-3 text-purple-600" /> Inkonchain L2
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/80">
                    <span className="text-[10px] text-slate-500 uppercase font-medium block">Traits Total</span>
                    <span className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
                      <Layers className="w-3 h-3 text-purple-600" /> 200+ Variations
                    </span>
                  </div>
                </div>

                {/* Interactive Switcher (rendered if multiple samples exist) */}
                {FEATURED_NFTS.length > 1 && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Preview Sample:
                    </span>
                    <div className="flex items-center gap-2">
                      {FEATURED_NFTS.map((nft, idx) => (
                        <button
                          key={nft.id}
                          onClick={() => setSelectedNFT(nft)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                            selectedNFT.id === nft.id
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          <span>Sample {idx + 1}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};
