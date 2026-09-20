import React from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';

interface NavbarProps {
  onJoinWhitelistClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onJoinWhitelistClick,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FEF3C7]/90 backdrop-blur-md border-b border-amber-300/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <a href="/" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-200/60 border border-amber-300/80 p-0.5 overflow-hidden group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center shadow-xs">
            <img
              src="/nft/179.png"
              alt="BunInk Genesis"
              className="w-full h-full object-cover rounded-[10px]"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-display">
                BunInk
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Inkonchain Network</span>
            </div>
          </div>
        </a>

        {/* Navigation items */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
          <a
            href="#tasks"
            className="hover:text-purple-700 transition-colors duration-150 py-1"
          >
            Whitelist Quests
          </a>
          <a
            href="#check-eligibility"
            className="hover:text-purple-700 transition-colors duration-150 py-1"
          >
            Eligibility Checker
          </a>

          <a
            href="https://explorer.inkonchain.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-purple-700 transition-colors duration-150 py-1"
          >
            <span>Explorer</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* X / Twitter link */}
          <a
            href="https://x.com/Bunnink0"
            target="_blank"
            rel="noreferrer"
            className="p-2 sm:p-2.5 rounded-xl border border-amber-300/80 bg-amber-50/80 hover:bg-white text-slate-800 hover:text-black transition-colors shadow-xs"
            title="Follow @Bunnink0 on X"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.254 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
          </a>

          {/* Action button */}
          <button
            onClick={onJoinWhitelistClick}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white transition-all shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-purple-200" />
            <span>Join Whitelist</span>
          </button>
        </div>
      </div>
    </header>
  );
};
