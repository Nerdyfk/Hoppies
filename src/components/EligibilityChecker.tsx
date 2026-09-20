import React, { useState } from 'react';
import { Search, Wallet, CheckCircle2, Clock, AlertCircle, Copy, Check, ArrowRight } from 'lucide-react';
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
  const [inputError, setInputError] = useState('');

  const handleSearch = async (addressToSearch?: string) => {
    setInputError('');
    const target = (addressToSearch || walletQuery).trim();
    if (!target) {
      setInputError('Please enter an EVM wallet address to check.');
      showToast('warning', 'Please enter a wallet address to check.');
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(target)) {
      setInputError('Invalid EVM address (must be 0x followed by 40 hex characters)');
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

  return (
    <section id="check-eligibility" className="relative scroll-mt-24 py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Retro Header */}
        <h2 className="font-pixel text-[#181d27] text-sm sm:text-base lg:text-lg tracking-wider select-none">
          CHECK ELIGIBILITY
        </h2>

        {/* Card matching the Whitelist Quests style and size */}
        <div className="rounded-2xl bg-[#141822] border border-[#232a3b] p-5 sm:p-6 transition-all hover:border-[#323c52] shadow-xl shadow-black/40">
          
          {/* Card Header Row */}
          <div className="flex items-start gap-4">
            {/* Icon Box */}
            <div className="w-12 h-12 rounded-xl bg-[#1d2332] border border-[#2e374d] flex items-center justify-center shrink-0 text-white">
              <Search className="w-5 h-5 text-white" />
            </div>

            {/* Content Header */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="font-pixel text-[11px] sm:text-[12px] text-white leading-relaxed tracking-wide">
                <span>VERIFY INKONCHAIN WALLET</span>
              </div>

              <div className="mt-2.5">
                <span className="font-pixel text-[9px] px-2.5 py-1 rounded bg-[#0b1c2d] border border-sky-600/60 text-[#38BDF8] uppercase inline-block">
                  STATUS AUDIT
                </span>
              </div>
            </div>
          </div>

          {/* Input Field with Blue Glow */}
          <div className="mt-4 sm:mt-5 space-y-3">
            <input
              type="text"
              placeholder="0x1234567890abcdef1234567890abcdef12345678"
              value={walletQuery}
              onChange={(e) => {
                setWalletQuery(e.target.value);
                if (inputError) setInputError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl bg-[#10131b] border border-sky-700/60 focus:border-[#38BDF8] text-white placeholder:text-[#52647d] font-pixel text-[10px] sm:text-[11px] outline-none shadow-[0_0_12px_rgba(56,189,248,0.12)] focus:shadow-[0_0_16px_rgba(56,189,248,0.25)] transition-all"
            />
            {inputError && (
              <p className="font-pixel text-[8px] text-rose-400">{inputError}</p>
            )}

            {/* Quick helper chip for submitted wallet */}
            {userSubmittedWallet && userSubmittedWallet !== walletQuery && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setWalletQuery(userSubmittedWallet);
                    handleSearch(userSubmittedWallet);
                  }}
                  className="font-pixel text-[8px] sm:text-[9px] px-3 py-1.5 rounded-lg bg-[#0b1c2d] border border-sky-600/60 hover:border-[#38BDF8] text-[#38BDF8] transition-all cursor-pointer"
                >
                  [ USE MY SUBMITTED WALLET ]
                </button>
              </div>
            )}

            {/* Action Button matching the Quests Submit button */}
            <div className="pt-2">
              <button
                onClick={() => handleSearch()}
                disabled={isChecking}
                className="w-full py-4 px-6 rounded-xl font-pixel text-xs sm:text-sm uppercase tracking-wider bg-[#38BDF8] hover:bg-[#7dd3fc] active:bg-[#0284c7] text-[#08121e] font-bold shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChecking ? (
                  <span>CHECKING...</span>
                ) : (
                  <span>CHECK WHITELIST STATUS</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Card */}
        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {result.status === 'WHITELISTED' ? (
              <div className="rounded-2xl bg-[#131722] border border-emerald-500/50 p-5 sm:p-6 shadow-[0_0_20px_rgba(16,185,129,0.15)] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#222836]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-pixel text-white text-xs sm:text-sm tracking-wide">
                        STATUS: WHITELISTED
                      </h3>
                      <p className="font-mono text-xs text-emerald-400 mt-0.5">
                        Eligible for official Genesis mint on Inkonchain L2
                      </p>
                    </div>
                  </div>

                  <span className="font-pixel text-[9px] px-3 py-1.5 rounded bg-emerald-950/80 border border-emerald-500/60 text-emerald-400 uppercase inline-block self-start sm:self-auto">
                    APPROVED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-[#181d2a] border border-[#262e40]">
                    <span className="text-slate-400 text-[11px] block">Allocation Tier</span>
                    <span className="text-emerald-300 font-bold block mt-0.5">
                      {result.tier || 'Wave 1 Priority Guaranteed'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#181d2a] border border-[#262e40]">
                    <span className="text-slate-400 text-[11px] block">Network</span>
                    <span className="text-[#38BDF8] font-bold block mt-0.5">
                      Inkonchain (EVM L2)
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-[#0f121a] border border-[#262e40] p-3 flex items-center justify-between text-xs font-mono text-slate-300">
                  <span className="truncate mr-2 font-semibold select-all">{result.wallet}</span>
                  <button
                    onClick={() => handleCopyAddress(result.wallet || '')}
                    className="font-pixel text-[8px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : result.status === 'PENDING' ? (
              <div className="rounded-2xl bg-[#131722] border border-sky-600/50 p-5 sm:p-6 shadow-[0_0_20px_rgba(56,189,248,0.15)] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#222836]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0b1c2d] border border-sky-600/60 flex items-center justify-center text-[#38BDF8] shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-pixel text-white text-xs sm:text-sm tracking-wide">
                        STATUS: UNDER REVIEW
                      </h3>
                      <p className="font-mono text-xs text-[#38BDF8] mt-0.5">
                        Application submitted & awaiting snapshot verification
                      </p>
                    </div>
                  </div>

                  <span className="font-pixel text-[9px] px-3 py-1.5 rounded bg-[#0b1c2d] border border-sky-600/60 text-[#38BDF8] uppercase inline-block self-start sm:self-auto">
                    UNDER REVIEW
                  </span>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#181d2a] border border-[#262e40] text-xs text-slate-400">
                  <AlertCircle className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed font-mono">
                    Your application proofs are stored. Allocation review is ongoing prior to the official mint snapshot.
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-[#131722] border border-[#2a3244] p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#222836]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1b2130] border border-[#2e374d] flex items-center justify-center text-slate-400 shrink-0">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-pixel text-white text-xs sm:text-sm tracking-wide">
                        STATUS: NOT REGISTERED
                      </h3>
                      <p className="font-mono text-xs text-slate-400 mt-0.5">
                        No whitelist submission found for this wallet address.
                      </p>
                    </div>
                  </div>

                  <span className="font-pixel text-[9px] px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-400 uppercase inline-block self-start sm:self-auto">
                    NOT FOUND
                  </span>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="font-mono text-xs text-slate-400 text-center sm:text-left">
                    Complete the quests above to apply for whitelist priority.
                  </p>
                  <a
                    href="#tasks"
                    className="font-pixel text-[9px] px-4 py-2.5 rounded-xl bg-[#38BDF8] hover:bg-[#7dd3fc] text-[#08121e] font-bold transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <span>JOIN QUESTS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
