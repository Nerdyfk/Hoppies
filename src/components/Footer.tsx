import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#FEF3C7] border-t border-amber-300/80 mt-20 py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand & Mission */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-200/60 border border-amber-300/80 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
              <img
                src="/nft/179.png"
                alt="BunInk"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base">BunInk</span>
              <span className="text-xs text-purple-700 font-semibold">
                Small Bunnies. Big Stories. 🐰
              </span>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-xs text-slate-600">
            © 2026 BunInk. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
