import React, { useState, useRef } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Sparkles,
  Zap,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Flame,
  Milestone
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ROADMAP_PHASES } from '../data/mockData.ts';

// Enhanced phase metadata for rich professional timeline
const PHASE_METADATA = [
  {
    progress: 80,
    progressLabel: 'Genesis Whitelist & Mint Wave (80% Complete)',
    quarter: 'Q1 - Q2 2026',
    icon: Zap,
    highlight: 'Active Focus',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  {
    progress: 0,
    progressLabel: 'DAO Governance & Bridge Development',
    quarter: 'Q3 2026',
    icon: Layers,
    highlight: 'Next Up',
    badgeClass: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  },
  {
    progress: 0,
    progressLabel: '$BINK TGE & Holder Staking Vault',
    quarter: 'Q4 2026',
    icon: Flame,
    highlight: 'Scheduled',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 28,
    },
  },
};

export const RoadmapSection: React.FC = () => {
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Smooth subtle ambient glow parallax
  const yGlow = useTransform(scrollYProgress, [0, 1], [-20, 30]);

  return (
    <section
      ref={sectionRef}
      id="roadmap"
      className="relative scroll-mt-24 space-y-8 py-4 overflow-visible"
    >
      {/* Ambient background glow with gentle parallax */}
      <motion.div
        style={{ y: yGlow }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[480px] h-[360px] bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-[130px] pointer-events-none -z-10"
      />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center max-w-2xl mx-auto space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Strategic Milestones</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
          The BunInk Journey
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto">
          From genesis mint on Inkonchain L2 to decentralized community governance, DeFi staking, and retroactive token rewards.
        </p>
      </motion.div>

      {/* Interactive Desktop Timeline Connector Rail */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.4 }}
        className="hidden md:block relative max-w-5xl mx-auto px-8"
      >
        {/* Background Track */}
        <div className="absolute top-1/2 left-16 right-16 h-1 -translate-y-1/2 bg-slate-800 rounded-full" />
        
        {/* Active Progress Fill Line (Phase 1 to Phase 2) */}
        <div className="absolute top-1/2 left-16 w-1/3 h-1 -translate-y-1/2 bg-gradient-to-r from-emerald-500 via-purple-500 to-purple-600 rounded-full shadow-sm shadow-purple-500/50" />

        {/* 3 Step Nodes */}
        <div className="relative flex justify-between items-center z-10">
          {ROADMAP_PHASES.map((phase, idx) => {
            const isCurrent = phase.status === 'In Progress';
            const isSelected = selectedPhaseIndex === idx;
            const meta = PHASE_METADATA[idx];
            const Icon = meta?.icon || Milestone;

            return (
              <button
                key={phase.phase}
                onClick={() => setSelectedPhaseIndex(isSelected ? null : idx)}
                className={`group flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-purple-900/40 border border-purple-500/60 ring-2 ring-purple-500/30'
                    : 'bg-slate-900/90 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Glowing Node Circle */}
                <div
                  className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 ring-2 ring-emerald-500/20 shadow-sm shadow-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 group-hover:text-slate-200 group-hover:border-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {isCurrent && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>

                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-400">
                      {phase.phase}
                    </span>
                    {isCurrent && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white block">
                    {phase.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* 3-Column Roadmap Cards Grid with Staggered Entrance and Hover Springs */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {ROADMAP_PHASES.map((phase, phaseIdx) => {
          const isCurrent = phase.status === 'In Progress';
          const isSelected = selectedPhaseIndex === phaseIdx;
          const meta = PHASE_METADATA[phaseIdx];
          const Icon = meta?.icon || Milestone;

          return (
            <motion.div
              key={phase.phase}
              variants={cardVariants}
              whileHover={{
                y: -6,
                transition: { type: 'spring', stiffness: 400, damping: 25 },
              }}
              onClick={() => setSelectedPhaseIndex(isSelected ? null : phaseIdx)}
              className={`relative rounded-2xl border p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer overflow-hidden ${
                isCurrent
                  ? 'bg-slate-900/90 border-purple-500/50 shadow-xl shadow-purple-950/30 ring-1 ring-purple-500/30'
                  : isSelected
                  ? 'bg-slate-900/95 border-purple-400/60 shadow-lg ring-1 ring-purple-400/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80 shadow-sm'
              }`}
            >
              {/* Top Accent Gradient Bar for Active Phase */}
              {isCurrent && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-emerald-400 to-purple-600 animate-pulse" />
              )}

              <div className="space-y-5">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-widest font-mono text-purple-400">
                        {phase.phase}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        • {meta?.quarter}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
                      <span>{phase.title}</span>
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {phase.tag}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 ${
                      isCurrent
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {isCurrent ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{phase.status}</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Progress Bar for Active Phase */}
                {isCurrent && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Whitelist Wave Progress
                      </span>
                      <span className="text-slate-300 font-bold">{meta.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${meta.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-purple-500 rounded-full"
                      />
                    </div>
                  </div>
                )}

                {/* Brief description */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {phase.description}
                </p>

                {/* Subtle Divider */}
                <div className="h-px w-full bg-slate-800/80" />

                {/* Deliverables Checklist with Micro-Hover Transitions */}
                <ul className="space-y-2.5">
                  {phase.items.map((item, idx) => {
                    const isDone = isCurrent && idx === 0;
                    return (
                      <li
                        key={idx}
                        className="group/item flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed hover:text-white transition-colors"
                      >
                        <span
                          className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover/item:scale-110 ${
                            isDone
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : isCurrent
                              ? 'bg-purple-500/15 text-purple-400'
                              : 'bg-slate-800 text-slate-500 group-hover/item:text-slate-300'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                        </span>
                        <span className={isDone ? 'text-slate-200' : ''}>
                          {item}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-5 mt-5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>Inkonchain L2</span>
                </span>
                <span className="flex items-center gap-1 text-purple-300 group-hover:text-purple-200">
                  <span>{meta?.highlight}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Live Roadmap Performance & Network Summary Strip */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-white font-semibold">Decentralized Execution Roadmap</p>
            <p className="text-slate-400 text-[11px]">Contract audits, fair distribution & Inkonchain foundation alignment.</p>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px] shrink-0">
          <div className="text-center sm:text-right">
            <span className="text-slate-500 block">CURRENT STAGE</span>
            <span className="text-emerald-400 font-bold">Phase 01 — Whitelist Mint</span>
          </div>
          <div className="w-px h-6 bg-slate-800 hidden sm:block" />
          <div className="text-center sm:text-right">
            <span className="text-slate-500 block">NEXT TARGET</span>
            <span className="text-purple-300 font-bold">Phase 02 — Web3 Utility</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
