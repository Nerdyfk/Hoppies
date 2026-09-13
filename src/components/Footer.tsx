import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 mt-20 py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand & Mission */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 overflow-hidden shrink-0 flex items-center justify-center">
              <img
                src="/nft/179.png"
                alt="BunInk"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white text-base">BunInk</span>
                <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                  Small Bunnies. Big Stories. 🐰
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Powered by Inkonchain L2 Network</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-400">
            <a
              href="https://x.com/Bunnink0"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-600 dark:hover:text-white transition-colors flex items-center gap-1.5"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.254 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
              </svg>
              <span>@Bunnink0 on X</span>
            </a>

            <a
              href="https://explorer.inkonchain.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-600 dark:hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Inkonchain Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href="#tasks"
              className="hover:text-purple-600 dark:hover:text-white transition-colors"
            >
              Whitelist
            </a>

            <a
              href="#roadmap"
              className="hover:text-purple-600 dark:hover:text-white transition-colors"
            >
              Roadmap
            </a>
          </div>

          {/* Copyright */}
          <div className="text-xs text-slate-500 dark:text-slate-400">
            © 2026 BunInk. All rights reserved.
          </div>

        </div>
      </div>
    </footer>
  );
};
