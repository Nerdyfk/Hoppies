import React, { useState, useRef } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Lock,
  Unlock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Edit2
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
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
  const [activeProofTaskId, setActiveProofTaskId] = useState<string | null>(null);
  const [proofInput, setProofInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletError, setWalletError] = useState('');

  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const totalRequired = tasks.filter((t) => t.required).length;
  const isAllRequiredDone = tasks.filter((t) => t.required).every((t) => t.isCompleted);
  const progressPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const handleOpenProofModal = (task: Task) => {
    setActiveProofTaskId(task.id);
    setProofInput(task.userProof || '');
  };

  const handleSaveProof = (taskId: string) => {
    const trimmed = proofInput.trim();
    if (!trimmed) {
      showToast('warning', 'Please enter your X handle (@username) or tweet link before confirming proof.');
      return;
    }
    onCompleteTask(taskId, trimmed);
    setActiveProofTaskId(null);
    setProofInput('');
    showToast('success', 'Task proof saved successfully!');
  };

  const validateAddress = (addr: string): boolean => {
    const evmRegex = /^0x[a-fA-F0-9]{40}$/;
    return evmRegex.test(addr.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWalletError('');

    if (!isAllRequiredDone) {
      showToast('warning', 'Please complete and save proof for all required tasks first.');
      return;
    }

    const trimmed = walletInput.trim();
    if (!trimmed) {
      setWalletError('Please enter your EVM wallet address');
      return;
    }

    if (!validateAddress(trimmed)) {
      setWalletError('Invalid EVM address format. Must begin with 0x followed by 40 hexadecimal characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSubmitApplication(trimmed);
      if (success) {
        setWalletInput('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Subtle vertical parallax movement
  const yCard = useTransform(scrollYProgress, [0, 1], [25, -25]);
  const yGlow = useTransform(scrollYProgress, [0, 1], [-20, 30]);

  return (
    <section ref={sectionRef} id="tasks" className="relative scroll-mt-24 space-y-6">
      {/* Subtle floating ambient glow */}
      <motion.div
        style={{ y: yGlow }}
        className="absolute -top-16 -right-12 w-80 h-80 bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-[100px] pointer-events-none -z-10"
      />

      <motion.div style={{ y: yCard }} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        
        {/* Header with Progress Tracker */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-2">
              Step 1: Whitelist Entry
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Complete Community Tasks
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Complete all required actions below, submit your proof, and link your Inkonchain EVM address to guarantee mint eligibility.
            </p>
          </div>

          {/* Progress Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shrink-0 min-w-[260px] sm:min-w-[300px]">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Tasks Completed</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                  {completedCount} <span className="text-slate-400 dark:text-slate-500 font-normal">/ {totalTasks}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 font-mono">
                  {progressPercentage}%
                </span>
              </div>
            </div>
            
            {/* Visual Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-medium mt-2 text-slate-500 dark:text-slate-400">
              {completedCount === totalTasks ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> All {totalTasks} tasks completed!
                </span>
              ) : (
                <span>
                  {totalTasks - completedCount} {totalTasks - completedCount === 1 ? 'task' : 'tasks'} remaining
                </span>
              )}
              {isAllRequiredDone ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready to submit
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400">
                  Required tasks pending
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Visual Progress Bar Strip */}
        <div className="pt-6">
          <div className="p-4 rounded-xl bg-purple-500/[0.04] dark:bg-purple-500/[0.06] border border-purple-200/70 dark:border-purple-800/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Overall Progress
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  ({completedCount} of {totalTasks} available tasks completed)
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-purple-700 dark:text-purple-300">
                {progressPercentage}% Completed
              </span>
            </div>

            {/* Visual Bar */}
            <div className="relative w-full h-3 rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Task Checklist Pill Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
              {tasks.map((task, idx) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                    task.isCompleted
                      ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 font-medium'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div className="shrink-0">
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        {idx + 1}
                      </div>
                    )}
                  </div>
                  <span className="truncate font-medium">
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4 pt-4">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all duration-200 ${
                task.isCompleted
                  ? 'bg-purple-500/[0.03] dark:bg-purple-500/[0.05] border-purple-500/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Left Task Content */}
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                    task.isCompleted
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="w-5 h-5 flex items-center justify-center font-mono font-bold text-xs">
                        0{index + 1}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {task.title}
                      </h3>
                      {task.required && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          Required
                        </span>
                      )}
                      {task.isCompleted && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Proof Saved
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                      {task.description}
                    </p>
                    {task.userProof && (
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-mono flex items-center gap-1 pt-1">
                        <span>Proof:</span> <span className="underline">{task.userProof}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Task Actions */}
                <div className="flex items-center gap-2 sm:self-center shrink-0">
                  <a
                    href={task.action_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <span>Open on X</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {task.isCompleted ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenProofModal(task)}
                        className="px-3 py-2 rounded-lg text-xs font-semibold border border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit Proof</span>
                      </button>
                      {onResetTask && (
                        <button
                          type="button"
                          onClick={() => onResetTask(task.id)}
                          className="px-2.5 py-2 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
                          title="Clear this proof"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenProofModal(task)}
                      className="px-4 py-2 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer shadow-sm"
                    >
                      Enter Proof
                    </button>
                  )}
                </div>

              </div>

              {/* In-card Proof Form if opened */}
              {activeProofTaskId === task.id && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Enter your X handle (e.g. @yourname) or post link as proof..."
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
                      className="w-full px-3.5 py-2 rounded-lg text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                      autoFocus
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSaveProof(task.id)}
                      disabled={!proofInput.trim()}
                      className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors cursor-pointer"
                    >
                      Confirm Proof
                    </button>
                    <button
                      onClick={() => setActiveProofTaskId(null)}
                      className="px-3 py-2 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>

        {/* Wallet Submission Form Area */}
        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
          
          {application ? (
            /* Already Submitted Status Card */
            <div className="p-5 sm:p-6 rounded-xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="font-bold text-sm">Whitelist Application Active</span>
                </div>
                <span className="px-2.5 py-0.5 text-xs font-mono font-semibold uppercase bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 rounded-md">
                  {application.status}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                Your wallet has been recorded for the official BunInk mint whitelist on Inkonchain.
              </p>
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 break-all">
                {application.walletAddress}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span>Tier: {application.tier || 'Wave 1 Priority'}</span>
                <span>Submitted: {new Date(application.submittedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ) : (
            /* Submission Form */
            <div className={`space-y-4 ${!isAllRequiredDone ? 'opacity-80' : ''}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Inkonchain EVM Wallet Address
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                      Required
                    </span>
                    {!isAllRequiredDone && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Locked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {isAllRequiredDone
                      ? 'Enter your EVM compatible address (starts with 0x) to receive whitelist priority on Inkonchain.'
                      : 'Complete all required task proofs above to submit your wallet.'}
                  </p>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5 self-start sm:self-auto">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Inkonchain L2 EVM</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="0x..."
                      value={walletInput}
                      onChange={(e) => {
                        setWalletInput(e.target.value);
                        setWalletError('');
                      }}
                      disabled={!isAllRequiredDone || isSubmitting}
                      className={`w-full px-4 py-3 rounded-xl text-sm font-mono transition-all duration-200 bg-slate-50 dark:bg-slate-950 border ${
                        walletError
                          ? 'border-rose-500 focus:border-rose-500 text-rose-500'
                          : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-purple-500'
                      } placeholder-slate-400 focus:outline-none disabled:bg-slate-100 dark:disabled:bg-slate-950/40 disabled:cursor-not-allowed`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!isAllRequiredDone || isSubmitting}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  >
                    {isSubmitting ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Submit Whitelist Application</span>
                      </>
                    )}
                  </button>
                </div>

                {walletError && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{walletError}</span>
                  </p>
                )}
              </form>
            </div>
          )}

        </div>

      </motion.div>
    </section>
  );
};
