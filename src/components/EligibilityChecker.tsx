import React, { useState, useRef } from 'react';
import { Search, Wallet, CheckCircle2, Clock, AlertCircle, ArrowUpRight, Copy, Check } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { WhitelistCheckResponse } from '../types.ts';

interface EligibilityCheckerProps {
  onCheckStatus: (wallet: string) => Promise<WhitelistCheckResponse>;
  userSubmittedWallet?: string;
  showToast: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
}

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({
  onCheckStatus,
  userSubmittedWallet,
  showToast,
}) => {
  const [walletQuery, setWalletQuery] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<WhitelistCheckResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleWhitelisted = '0x71c8413204c38ff240097621f37e42d713c72b22';

  const handleSearch = async (addressToSearch?: string) => {
    const target = (addressToSearch || walletQuery).trim();
    if (!target) {
      showToast('warning', 'Please enter a wallet address to check.');
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(target)) {
      showToast('error', 'Please enter a valid 42-character EVM address (0x...).');
      return;
    }

    setIsChecking(true);
    setResult(null);

    try {
      const res = await onCheckStatus(target);
      setResult(res);
      if (res.status === 'WHITELISTED') {
        showToast('success', 'Wallet is Whitelisted!');
      } else if (res.status === 'PENDING') {
        showToast('info', 'Application is under review.');
      } else {
        showToast('warning', 'Address not found in whitelist database.');
      }
    } catch {
      showToast('error', 'Failed to check whitelist status. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleCopyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopied(true);
    showToast('info', 'Address copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const yCard = useTransform(scrollYProgress, [0, 1], [25, -25]);
  const yGlow = useTransform(scrollYProgress, [0, 1], [-15, 25]);

  return (
    <section ref={sectionRef} id="check-eligibility" className="relative scroll-mt-24 space-y-6">
      {/* Subtle floating ambient glow */}
      <motion.div
        style={{ y: yGlow }}
        className="absolute -top-12 -left-10 w-72 h-72 bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-[90px] pointer-events-none -z-10"
      />

      <motion.div style={{ y: yCard }} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-2">
            Step 2: Verification
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Check Whitelist Status
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Search any Inkonchain EVM wallet address to confirm whitelist approval, allocation tier, and priority wave.
          </p>
        </div>

        {/* Input & Search Controls */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Wallet className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Paste wallet address — 0x..."
                value={walletQuery}
                onChange={(e) => setWalletQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-mono bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={() => handleSearch()}
              disabled={isChecking}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isChecking ? (
                <span>Checking...</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Check Status</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Helper Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Quick test:</span>
            <button
              type="button"
              onClick={() => {
                setWalletQuery(sampleWhitelisted);
                handleSearch(sampleWhitelisted);
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 text-slate-700 dark:text-slate-300 font-mono transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              Sample Whitelisted Wallet
            </button>

            {userSubmittedWallet && userSubmittedWallet !== walletQuery && (
              <button
                type="button"
                onClick={() => {
                  setWalletQuery(userSubmittedWallet);
                  handleSearch(userSubmittedWallet);
                }}
                className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono transition-colors cursor-pointer border border-purple-500/20"
              >
                Use My Submitted Wallet
              </button>
            )}
          </div>
        </div>

        {/* Results Card */}
        {result && (
          <div className="pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {result.status === 'WHITELISTED' ? (
              <div className="p-5 sm:p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Whitelist Status: Confirmed
                      </h3>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300">
                        Eligible for official Inkonchain mint priority
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-500 text-white self-start sm:self-auto">
                    Whitelisted
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-medium block">
                      Allocation Tier
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">
                      {result.tier || 'Wave 1 Priority Guaranteed'}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-medium block">
                      Mint Network
                    </span>
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400 mt-0.5 block font-mono">
                      Inkonchain (EVM L2)
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-700 dark:text-slate-300">
                  <span className="truncate mr-2">{result.wallet}</span>
                  <button
                    onClick={() => handleCopyAddress(result.wallet || '')}
                    className="p-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    title="Copy Address"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ) : result.status === 'PENDING' ? (
              <div className="p-5 sm:p-6 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Application Under Review
                      </h3>
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        Proofs saved. Verification snapshot is currently in progress.
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-500 text-white self-start sm:self-auto">
                    Under Review
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Your wallet is queued for snapshot confirmation. <span className="font-semibold text-slate-800 dark:text-slate-200">Please note:</span> application submission does <span className="underline font-semibold">not guarantee</span> a whitelist slot of the mint due to the strict 2,222 total supply limit. Spots are confirmed once proofs are audited.
                </p>
              </div>
            ) : (
              <div className="p-5 sm:p-6 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Wallet Not Registered
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        No whitelist application found for this address.
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 self-start sm:self-auto">
                    Not Found
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Complete the Step 1 community tasks to submit your application now.
                  </p>
                  <a
                    href="#tasks"
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition-colors flex items-center gap-1 shrink-0"
                  >
                    <span>Complete Tasks</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

      </motion.div>
    </section>
  );
};
