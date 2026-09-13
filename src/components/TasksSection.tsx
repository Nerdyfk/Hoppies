import React, { useState, useRef } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Lock,
  Unlock,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Edit2,
  Copy,
  Check,
  Zap,
  Ticket,
  Award,
  ArrowRight,
  Flame,
  Globe,
  HelpCircle,
} from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Task, WhitelistApplication } from '../types.ts';

interface TasksSectionProps {
  tasks: Task[];
  onCompleteTask: (taskId: string, proof: string) => void;
  onResetTask?: (taskId: string) => void;
  onSubmitApplication: (wallet: string, xHandle?: string) => Promise<boolean>;
  application: WhitelistApplication | null;
  showToast: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
}

export const TasksSection: React.FC<TasksSectionProps> = ({
  tasks,
  onCompleteTask,
  onResetTask,
  onSubmitApplication,
  application,
  showToast,
}) => {
  const [walletInput, setWalletInput] = useState('');
  const [xHandleInput, setXHandleInput] = useState('');
  const [activeProofTaskId, setActiveProofTaskId] = useState<string | null>(null);
  const [proofInput, setProofInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletError, setWalletError] = useState('');
  const [copiedPass, setCopiedPass] = useState(false);

  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const isAllRequiredDone = tasks.filter((t) => t.required).every((t) => t.isCompleted);
  const progressPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const handleOpenProofModal = (task: Task) => {
    setActiveProofTaskId(task.id);
    setProofInput(task.userProof || '');
  };

  const handleSaveProof = (taskId: string) => {
    const trimmed = proofInput.trim();
    if (!trimmed) {
      showToast('warning', 'Please enter your X handle (@username) or tweet link as verification proof.');
      return;
    }
    onCompleteTask(taskId, trimmed);
    setActiveProofTaskId(null);
    setProofInput('');
    showToast('success', 'Quest proof verified and stored!');
  };

  const validateAddress = (addr: string): boolean => {
    const evmRegex = /^0x[a-fA-F0-9]{40}$/;
    return evmRegex.test(addr.trim());
  };

  const isWalletValid = validateAddress(walletInput);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWalletError('');

    if (!isAllRequiredDone) {
      showToast('warning', 'Please complete and confirm proof for all required quests first.');
      return;
    }

    const trimmed = walletInput.trim();
    if (!trimmed) {
      setWalletError('Please enter your EVM wallet address');
      return;
    }

    if (!validateAddress(trimmed)) {
      setWalletError('Invalid EVM address format. Must begin with 0x followed by 40 hex characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSubmitApplication(trimmed, xHandleInput.trim() || undefined);
      if (success) {
        setWalletInput('');
        setXHandleInput('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyPassAddress = () => {
    if (!application?.walletAddress) return;
    navigator.clipboard.writeText(application.walletAddress);
    setCopiedPass(true);
    showToast('success', 'Wallet address copied to clipboard');
    setTimeout(() => setCopiedPass(false), 2000);
  };

  const handlePasteAddress = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setWalletInput(text.trim());
        setWalletError('');
      }
    } catch {
      showToast('info', 'Please paste your wallet address directly into the field.');
    }
  };

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const yCard = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const yGlow = useTransform(scrollYProgress, [0, 1], [-25, 35]);

  return (
    <section ref={sectionRef} id="tasks" className="relative scroll-mt-24 space-y-8">
      {/* Radiant Background Glows */}
      <motion.div
        style={{ y: yGlow }}
        className="absolute -top-24 -right-16 w-96 h-96 bg-gradient-to-br from-purple-600/20 via-[#7B3FE4]/15 to-transparent rounded-full blur-[120px] pointer-events-none -z-10"
      />
      <motion.div
        style={{ y: yGlow }}
        className="absolute -bottom-20 -left-16 w-80 h-80 bg-gradient-to-tr from-emerald-500/15 via-purple-600/10 to-transparent rounded-full blur-[100px] pointer-events-none -z-10"
      />

      <motion.div
        style={{ y: yCard }}
        className="relative rounded-3xl bg-slate-900/90 dark:bg-[#0E1322]/95 border border-purple-500/20 dark:border-purple-500/25 p-6 sm:p-10 shadow-2xl shadow-purple-950/40 backdrop-blur-xl overflow-hidden"
      >
        {/* Top Holographic Edge Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-500 via-purple-400 to-emerald-400" />

        {/* Header Section with VIP Status Badge & Perks */}
        <div className="space-y-6 pb-8 border-b border-slate-800">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              {/* Live Badge Strip */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Step 01 • Genesis Whitelist</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  <span>Wave 1: High Priority (80% Claimed)</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
                Whitelist Access Portal
              </h2>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Complete the official community verification quests below, submit your proof, and secure your cryptographic mint allocation on <span className="text-purple-300 font-semibold">Inkonchain L2</span>.
              </p>
            </div>

            {/* VIP Allocation Progress Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-purple-950/30 to-slate-900/90 border border-purple-500/30 shrink-0 min-w-[280px] sm:min-w-[320px] shadow-lg shadow-purple-950/20">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2.5">
                <span className="flex items-center gap-1.5 text-purple-300">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Quest Verification</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-white">
                    {completedCount} <span className="text-slate-500 font-normal">/ {totalTasks}</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                    {progressPercentage}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden p-0.5">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-emerald-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-medium mt-3 text-slate-400">
                {isAllRequiredDone ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Whitelist Unlocked
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> {totalTasks - completedCount} Quests Remaining
                  </span>
                )}
                <span className="font-mono text-purple-300">
                  Tier: {isAllRequiredDone ? 'Guaranteed' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Guaranteed Perks Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs">
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="text-white font-semibold">Guaranteed Mint</p>
                <p className="text-slate-400 text-[11px]">Up to 2 NFTs per verified wallet</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-white font-semibold">Sub-Cent Gas Fees</p>
                <p className="text-slate-400 text-[11px]">Powered by Inkonchain L2 network</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs">
              <div className="w-8 h-8 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-300 shrink-0">
                <Ticket className="w-4 h-4" />
              </div>
              <div>
                <p className="text-white font-semibold">24H Early Access</p>
                <p className="text-slate-400 text-[11px]">Priority window before public sale</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <p className="text-white font-semibold">$BINK Token Airdrop</p>
                <p className="text-slate-400 text-[11px]">Future retroactive loyalty points</p>
              </div>
            </div>
          </div>

        </div>

        {/* Quests Container */}
        <div className="space-y-4 pt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest font-mono text-purple-400">
                REQUIRED QUESTS
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ({completedCount} of {totalTasks} Verified)
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
              Click "Verify Proof" after completing on X
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {tasks.map((task, index) => {
              const isOpen = activeProofTaskId === task.id;

              return (
                <div
                  key={task.id}
                  className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden ${
                    task.isCompleted
                      ? 'bg-gradient-to-r from-emerald-950/20 via-slate-900/80 to-slate-900/90 border-emerald-500/40 shadow-sm'
                      : 'bg-slate-900/70 border-slate-800 hover:border-purple-500/40 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      {/* Quest Details */}
                      <div className="flex items-start gap-4">
                        {/* Status Icon Orb */}
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                            task.isCompleted
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                              : 'bg-slate-800 text-purple-400 border border-slate-700 group-hover:border-purple-500/40'
                          }`}
                        >
                          {task.isCompleted ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                          ) : (
                            <span className="font-mono font-bold text-sm">
                              0{index + 1}
                            </span>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                              Quest 0{index + 1}
                            </span>

                            {task.required && (
                              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                Required
                              </span>
                            )}

                            {task.isCompleted ? (
                              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Proof Stored
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-slate-800 text-slate-400 font-mono">
                                +100 WL XP
                              </span>
                            )}
                          </div>

                          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                            {task.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                            {task.description}
                          </p>

                          {task.userProof && (
                            <div className="pt-1 flex items-center gap-2 text-xs">
                              <span className="text-slate-400 font-mono">Stored Proof:</span>
                              <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300 font-mono break-all">
                                {task.userProof}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quest Action Buttons */}
                      <div className="flex items-center gap-2.5 sm:self-center shrink-0 pt-2 sm:pt-0">
                        <a
                          href={task.action_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <span>Open on X</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </a>

                        {task.isCompleted ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenProofModal(task)}
                              className="px-3 py-2 rounded-xl text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/40 text-purple-300 transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Edit Proof</span>
                            </button>
                            {onResetTask && (
                              <button
                                type="button"
                                onClick={() => onResetTask(task.id)}
                                className="px-2.5 py-2 rounded-xl text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                title="Reset proof"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenProofModal(task)}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-950/40 transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Verify Proof</span>
                          </button>
                        )}
                      </div>

                    </div>

                    {/* Integrated Smooth Proof Verification Drawer */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="mt-4 pt-4 border-t border-slate-800"
                        >
                          <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/30 space-y-3">
                            <div className="flex items-center justify-between text-xs text-slate-300">
                              <span className="font-semibold text-purple-300 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" />
                                Submit Verification Proof for Quest 0{index + 1}
                              </span>
                              <span className="text-slate-400 font-mono text-[11px]">
                                Instant validation
                              </span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                              <input
                                type="text"
                                placeholder="Enter your X handle (e.g. @yourhandle) or tweet link..."
                                value={proofInput}
                                onChange={(e) => setProofInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSaveProof(task.id);
                                  } else if (e.key === 'Escape') {
                                    setActiveProofTaskId(null);
                                  }
                                }}
                                className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                                autoFocus
                              />

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleSaveProof(task.id)}
                                  disabled={!proofInput.trim()}
                                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all shadow-md cursor-pointer flex items-center gap-1.5 shrink-0"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Confirm Proof</span>
                                </button>
                                <button
                                  onClick={() => setActiveProofTaskId(null)}
                                  className="px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>

                            <p className="text-[11px] text-slate-400">
                              Tip: You can provide your Twitter/X username handle or direct link to your retweet/post.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Final EVM Address Submission or Verified Pass */}
        <div className="mt-10 pt-8 border-t border-slate-800">
          
          {application ? (
            /* PRESTIGE DIGITAL WHITELIST PASS */
            <div className="relative rounded-2xl bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-950 border border-purple-500/40 p-6 sm:p-8 shadow-2xl overflow-hidden">
              {/* Holographic Watermark Pattern */}
              <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-purple-500/10 rounded-full blur-[70px] pointer-events-none" />
              
              <div className="relative space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-purple-500/20">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-950/50">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-extrabold text-white font-display">
                          Official Whitelist Pass
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          {application.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Cryptographically recorded for the BunInk Genesis Mint on Inkonchain L2
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right font-mono">
                    <span className="text-[11px] text-slate-400 block uppercase">Allocation Tier</span>
                    <span className="text-sm font-bold text-purple-300">
                      {application.tier || 'Wave 1 Priority Guaranteed'}
                    </span>
                  </div>
                </div>

                {/* Wallet Details Display Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  <div className="md:col-span-2 p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-mono">Registered Inkonchain Address</span>
                      <button
                        onClick={handleCopyPassAddress}
                        className="text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer text-[11px]"
                      >
                        {copiedPass ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="font-mono text-xs sm:text-sm font-bold text-white break-all select-all">
                      {application.walletAddress}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <span className="text-xs text-slate-400 font-mono block">Guaranteed Allocation</span>
                    <p className="text-base font-bold text-emerald-400 font-mono">
                      2 NFTs / Wallet
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      Submitted: {new Date(application.submittedAt).toLocaleDateString()}
                    </span>
                  </div>

                </div>

                {/* Pass Footer Links */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Eligible for automatic snapshot verification in smart contract</span>
                  </div>

                  <a
                    href="#check-eligibility"
                    className="text-purple-300 hover:text-white font-semibold flex items-center gap-1 transition-colors self-start sm:self-auto"
                  >
                    <span>Verify in Public Checker</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            </div>
          ) : (
            /* SUBMISSION FORM CONSOLE */
            <div className={`space-y-6 ${!isAllRequiredDone ? 'opacity-90' : ''}`}>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      Link Inkonchain EVM Address
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
                      Required
                    </span>

                    {!isAllRequiredDone ? (
                      <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase rounded-full bg-slate-800 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Quests Incomplete
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <Unlock className="w-3 h-3" /> Ready To Submit
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    {isAllRequiredDone
                      ? 'All quests verified! Enter your EVM address (0x...) to lock in your official Wave 1 whitelist reservation.'
                      : 'Complete and verify all required community quests above to unlock EVM address registration.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 self-start sm:self-auto">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Inkonchain L2 EVM (57073)</span>
                </div>
              </div>

              {/* Form Input Deck */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                  
                  {/* EVM Address Input */}
                  <div className="lg:col-span-8 relative">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="0x71C...B29 (EVM Address)"
                        value={walletInput}
                        onChange={(e) => {
                          setWalletInput(e.target.value);
                          setWalletError('');
                        }}
                        disabled={!isAllRequiredDone || isSubmitting}
                        className={`w-full px-4 py-3.5 rounded-2xl text-sm font-mono transition-all duration-200 bg-slate-950/90 border ${
                          walletError
                            ? 'border-rose-500 focus:border-rose-500 text-rose-400'
                            : isWalletValid
                            ? 'border-emerald-500/60 focus:border-emerald-500 text-white'
                            : 'border-slate-700 focus:border-purple-500 text-white'
                        } placeholder-slate-500 focus:outline-none disabled:bg-slate-950/40 disabled:border-slate-800 disabled:cursor-not-allowed`}
                      />

                      {/* Paste Button Helper */}
                      {isAllRequiredDone && !walletInput && (
                        <button
                          type="button"
                          onClick={handlePasteAddress}
                          className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-purple-300 transition-colors cursor-pointer"
                        >
                          Paste
                        </button>
                      )}

                      {/* Valid EVM indicator check */}
                      {isWalletValid && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 flex items-center gap-1 text-xs font-mono">
                          <Check className="w-4 h-4" /> Valid EVM
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Optional X / Discord Handle Input */}
                  <div className="lg:col-span-4">
                    <input
                      type="text"
                      placeholder="Your X Handle (e.g. @satoshi)"
                      value={xHandleInput}
                      onChange={(e) => setXHandleInput(e.target.value)}
                      disabled={!isAllRequiredDone || isSubmitting}
                      className="w-full px-4 py-3.5 rounded-2xl text-sm font-mono transition-all duration-200 bg-slate-950/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 disabled:bg-slate-950/40 disabled:border-slate-800 disabled:cursor-not-allowed"
                    />
                  </div>

                </div>

                {walletError && (
                  <p className="text-xs text-rose-400 flex items-center gap-1.5 pt-1">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{walletError}</span>
                  </p>
                )}

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <span>Zero gas signature required for submission. Anti-bot protected.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={!isAllRequiredDone || isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Confirming Allocation...</span>
                      </span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Lock In Whitelist Allocation</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
          )}

        </div>

      </motion.div>
    </section>
  );
};
