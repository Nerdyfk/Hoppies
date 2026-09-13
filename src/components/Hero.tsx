import React, { useState, useRef } from 'react';
import { Sparkles, ArrowRight, Layers, Zap, CheckCircle2 } from 'lucide-react';
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
            {/* Live Mint Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-purple-500/10 dark:bg-purple-950/40 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
              <span>Official Inkonchain Mint Launch</span>
            </div>

            {/* Tagline */}
            <p className="text-purple-600 dark:text-purple-400 font-semibold text-lg sm:text-xl tracking-tight">
              Small Bunnies. Big Stories. 🐰
            </p>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Join The Official <br />
              <span className="text-purple-600 dark:text-purple-400">BunInk</span> Whitelist
            </h1>

            {/* Paragraph */}
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              <strong className="text-slate-900 dark:text-white font-semibold">BunInk</strong> is a playful collection of unique digital bunnies on Inkonchain L2, each with its own personality, style, and story. From colorful outfits and quirky accessories to rare expressions and unexpected traits, every BunInk is one of a kind.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onJoinClick}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-bold text-base transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>Join Whitelist Now</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <a
                href="#tasks"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-purple-500 text-slate-800 dark:text-slate-200 font-semibold text-base text-center transition-all shadow-sm"
              >
                View Required Tasks ↓
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="pt-4 grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Supply</p>
                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5">2,222</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Traits</p>
                <p className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400 font-mono mt-0.5">200+</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gas Fees</p>
                <p className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">&lt; $0.01</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Clean NFT Card Showcase (floating differential parallax) */}
          <motion.div style={{ y: yRight }} className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
              {/* Card Image Area */}
              <div className="relative aspect-square bg-slate-100 dark:bg-slate-950 p-6 flex items-center justify-center overflow-hidden border-b border-slate-200 dark:border-slate-800">
                <img
                  src={selectedNFT.image}
                  alt={selectedNFT.name}
                  className="relative z-10 max-h-64 w-auto object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Card Info Details */}
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {selectedNFT.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Inkonchain Genesis Collection
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    ERC-721
                  </span>
                </div>

                {/* Traits preview grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium block">Chain</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1 mt-0.5">
                      <Zap className="w-3 h-3 text-purple-500" /> Inkonchain L2
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium block">Traits Total</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1 mt-0.5">
                      <Layers className="w-3 h-3 text-purple-500" /> 200+ Variations
                    </span>
                  </div>
                </div>

                {/* Interactive Switcher */}
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
              </div>
            </div>

            {/* Banner callout below card */}
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Snapshot taken periodically for verified whitelist entries</span>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};
