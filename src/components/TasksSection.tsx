import React, { useState, useEffect } from 'react';
import { Wallet, Check, CheckCircle2, Copy, AlertCircle } from 'lucide-react';
import { Task, WhitelistApplication } from '../types.ts';
import { triggerWhitelistConfetti } from '../utils/confetti.ts';

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
  onSubmitApplication,
  application,
  showToast,
}) => {
  const task1 = tasks[0];
  const task2 = tasks[1];

  const [followProof, setFollowProof] = useState(task1?.userProof || '');
  const [commentProof, setCommentProof] = useState(task2?.userProof || '');
  const [walletInput, setWalletInput] = useState(application?.walletAddress || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [errors, setErrors] = useState<{ follow?: string; comment?: string; wallet?: string }>({});

  // Synchronize inputs if external tasks or application change
  useEffect(() => {
    if (task1?.userProof && !followProof) {
      setFollowProof(task1.userProof);
    }
  }, [task1?.userProof]);

  useEffect(() => {
    if (task2?.userProof && !commentProof) {
      setCommentProof(task2.userProof);
    }
  }, [task2?.userProof]);

  useEffect(() => {
    if (application?.walletAddress && !walletInput) {
      setWalletInput(application.walletAddress);
    }
  }, [application?.walletAddress]);

  const validateAddress = (addr: string): boolean => {
    const evmRegex = /^0x[a-fA-F0-9]{40}$/;
    return evmRegex.test(addr.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { follow?: string; comment?: string; wallet?: string } = {};

    const cleanFollow = followProof.trim();
    const cleanComment = commentProof.trim();
    const cleanWallet = walletInput.trim();

    if (!cleanFollow) {
      newErrors.follow = 'Please enter your username or profile link';
    }

    if (!cleanComment) {
      newErrors.comment = 'Please enter your comment or status link';
    }

    if (!cleanWallet) {
      newErrors.wallet = 'Please enter your EVM wallet address';
    } else if (!validateAddress(cleanWallet)) {
      newErrors.wallet = 'Invalid EVM address (must be 0x followed by 40 hex characters)';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showToast('warning', 'Please complete all required quest fields properly.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Save proofs to tasks
      if (task1) onCompleteTask(task1.id, cleanFollow);
      if (task2) onCompleteTask(task2.id, cleanComment);

      const success = await onSubmitApplication(cleanWallet, cleanFollow);
      if (success) {
        triggerWhitelistConfetti();
        showToast('success', 'Whitelist application submitted successfully!');
      }
    } catch {
      showToast('error', 'Failed to submit application. Please try again.');
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

  return (
    <section id="tasks" className="relative scroll-mt-24 py-6">
      <div className="max-w-2xl mx-auto">
        {/* Retro Header */}
        <h2 className="font-pixel text-[#181d27] text-sm sm:text-base lg:text-lg tracking-wider mb-6 select-none">
          WHITELIST QUESTS
        </h2>

        {application ? (
          /* Application Submitted Success State */
          <div className="space-y-4">
            <div className="rounded-2xl bg-[#131722] border border-[#222836] p-6 sm:p-7 shadow-xl shadow-black/40 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#222836]">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#1b2130] border border-[#2c354a] flex items-center justify-center shrink-0 text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-pixel text-white text-xs sm:text-sm tracking-wide">
                      QUESTS COMPLETED
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      Your whitelist entry is registered & queued for review.
                    </p>
                  </div>
                </div>

                <span className="font-pixel text-[9px] px-3 py-1.5 rounded bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 uppercase inline-block self-start sm:self-auto">
                  {application.status === 'WHITELISTED' ? 'WHITELISTED' : 'PENDING REVIEW'}
                </span>
              </div>

              {/* Submitted Wallet Display */}
              <div className="rounded-xl bg-[#0f121a] border border-sky-600/50 p-4 sm:p-5 shadow-[0_0_12px_rgba(56,189,248,0.15)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-[9px] text-[#38BDF8] uppercase">
                    Registered EVM Wallet
                  </span>
                  <button
                    onClick={handleCopyPassAddress}
                    className="font-pixel text-[8px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedPass ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="font-mono text-xs sm:text-sm text-white font-semibold break-all select-all">
                  {application.walletAddress}
                </p>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-[#181d2a] border border-[#262e40]">
                  <span className="text-slate-400 text-[11px] block">X Handle / Proof</span>
                  <span className="text-sky-300 font-semibold truncate block mt-0.5">
                    {application.xHandle || followProof || 'Verified'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#181d2a] border border-[#262e40]">
                  <span className="text-slate-400 text-[11px] block">Mint Window</span>
                  <span className="text-purple-300 font-semibold block mt-0.5">
                    Wave 1 Priority Allocation
                  </span>
                </div>
              </div>

              {/* Status Note */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#181d2a] border border-[#262e40] text-xs text-slate-400">
                <AlertCircle className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Snapshot audit in progress. You can verify your status anytime using the Eligibility Checker below.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Form with the 3 Quest Cards */
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* CARD 1: Follow on X */}
            <div className="rounded-2xl bg-[#141822] border border-[#232a3b] p-5 sm:p-6 transition-all hover:border-[#323c52]">
              <div className="flex items-start gap-4">
                {/* Icon Box */}
                <div className="w-12 h-12 rounded-xl bg-[#1d2332] border border-[#2e374d] flex items-center justify-center shrink-0 text-white">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.254 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                  </svg>
                </div>

                {/* Content Header */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="font-pixel text-[11px] sm:text-[12px] leading-relaxed tracking-wide">
                    <span className="text-white">FOLLOW </span>
                    <a
                      href="https://x.com/Bunnink0"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#38BDF8] hover:underline cursor-pointer"
                      title="Follow @Bunnink0 on X"
                    >
                      @BUNNINK0
                    </a>
                  </div>

                  <div className="mt-2.5">
                    <span className="font-pixel text-[9px] px-2.5 py-1 rounded bg-[#0b1c2d] border border-sky-600/60 text-[#38BDF8] uppercase inline-block">
                      REQUIRED
                    </span>
                  </div>
                </div>
              </div>

              {/* Input Field */}
              <div className="mt-4 sm:mt-5">
                <input
                  type="text"
                  value={followProof}
                  onChange={(e) => {
                    setFollowProof(e.target.value);
                    if (errors.follow) setErrors((prev) => ({ ...prev, follow: undefined }));
                  }}
                  placeholder="@yourusername (or profile link)"
                  className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl bg-[#10131b] border border-sky-700/60 focus:border-[#38BDF8] text-white placeholder:text-[#52647d] font-pixel text-[10px] sm:text-[11px] outline-none shadow-[0_0_12px_rgba(56,189,248,0.12)] focus:shadow-[0_0_16px_rgba(56,189,248,0.25)] transition-all"
                />
                {errors.follow && (
                  <p className="font-pixel text-[8px] text-rose-400 mt-2">{errors.follow}</p>
                )}
              </div>
            </div>

            {/* CARD 2: Like, Repost & Comment on Pinned Post */}
            <div className="rounded-2xl bg-[#141822] border border-[#232a3b] p-5 sm:p-6 transition-all hover:border-[#323c52]">
              <div className="flex items-start gap-4">
                {/* Icon Box */}
                <div className="w-12 h-12 rounded-xl bg-[#1d2332] border border-[#2e374d] flex items-center justify-center shrink-0 text-white">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.254 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                  </svg>
                </div>

                {/* Content Header */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="font-pixel text-[11px] sm:text-[12px] leading-relaxed tracking-wide">
                    <a
                      href="https://x.com/Bunnink0"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#38BDF8] underline underline-offset-4 decoration-[#38BDF8] hover:opacity-90 cursor-pointer block"
                      title="Open pinned post on X"
                    >
                      LIKE, REPOST & COMMENT ON PINNED POST
                    </a>
                  </div>

                  <div className="mt-2.5">
                    <span className="font-pixel text-[9px] px-2.5 py-1 rounded bg-[#0b1c2d] border border-sky-600/60 text-[#38BDF8] uppercase inline-block">
                      REQUIRED
                    </span>
                  </div>
                </div>
              </div>

              {/* Input Field */}
              <div className="mt-4 sm:mt-5">
                <input
                  type="text"
                  value={commentProof}
                  onChange={(e) => {
                    setCommentProof(e.target.value);
                    if (errors.comment) setErrors((prev) => ({ ...prev, comment: undefined }));
                  }}
                  placeholder="https://x.com/.../status/... (comment link)"
                  className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl bg-[#10131b] border border-sky-700/60 focus:border-[#38BDF8] text-white placeholder:text-[#52647d] font-pixel text-[10px] sm:text-[11px] outline-none shadow-[0_0_12px_rgba(56,189,248,0.12)] focus:shadow-[0_0_16px_rgba(56,189,248,0.25)] transition-all"
                />
                {errors.comment && (
                  <p className="font-pixel text-[8px] text-rose-400 mt-2">{errors.comment}</p>
                )}
              </div>
            </div>

            {/* CARD 3: Submit EVM Wallet Address */}
            <div className="rounded-2xl bg-[#141822] border border-[#232a3b] p-5 sm:p-6 transition-all hover:border-[#323c52]">
              <div className="flex items-center gap-4">
                {/* Icon Box */}
                <div className="w-12 h-12 rounded-xl bg-[#1d2332] border border-[#2e374d] flex items-center justify-center shrink-0 text-white">
                  <Wallet className="w-5 h-5 text-white" />
                </div>

                {/* Content Header */}
                <div className="flex-1 min-w-0 flex flex-wrap items-center gap-3">
                  <span className="font-pixel text-[11px] sm:text-[12px] text-white tracking-wide leading-relaxed">
                    SUBMIT EVM WALLET ADDRESS
                  </span>
                  <span className="font-pixel text-[9px] px-2.5 py-1 rounded bg-[#0b1c2d] border border-sky-600/60 text-[#38BDF8] uppercase inline-block">
                    REQUIRED
                  </span>
                </div>
              </div>

              {/* Input Field */}
              <div className="mt-4 sm:mt-5">
                <input
                  type="text"
                  value={walletInput}
                  onChange={(e) => {
                    setWalletInput(e.target.value);
                    if (errors.wallet) setErrors((prev) => ({ ...prev, wallet: undefined }));
                  }}
                  placeholder="0x1234567890abcdef1234567890abcdef12345678"
                  className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl bg-[#10131b] border border-sky-700/60 focus:border-[#38BDF8] text-white placeholder:text-[#52647d] font-pixel text-[10px] sm:text-[11px] outline-none shadow-[0_0_12px_rgba(56,189,248,0.12)] focus:shadow-[0_0_16px_rgba(56,189,248,0.25)] transition-all"
                />
                {errors.wallet && (
                  <p className="font-pixel text-[8px] text-rose-400 mt-2">{errors.wallet}</p>
                )}
              </div>
            </div>

            {/* Submission Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl font-pixel text-xs sm:text-sm uppercase tracking-wider bg-[#38BDF8] hover:bg-[#7dd3fc] active:bg-[#0284c7] text-[#08121e] font-bold shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>SUBMITTING...</span>
                ) : (
                  <span>SUBMIT WHITELIST APPLICATION</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
