import React from 'react';
import { Cloud, Zap, ShieldCheck, DollarSign } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-white/8 bg-ink-900/70 backdrop-blur-md sticky top-0 z-30">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-azure-500/15 border border-azure-500/30 text-azure-400 shadow-[0_0_20px_rgba(0,120,212,0.25)]">
              <Cloud className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                  Azure Cost Finder
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live API
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400">
                Check current Azure public retail pricing in real time
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 rounded-lg border border-white/6 bg-white/[0.02] px-2.5 py-1 text-gray-400">
              <Zap className="h-3.5 w-3.5 text-gold-400" />
              <span>0 Cost · Client-Side</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-white/6 bg-white/[0.02] px-2.5 py-1 text-gray-400">
              <ShieldCheck className="h-3.5 w-3.5 text-azure-400" />
              <span>No Azure Login Required</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-white/6 bg-white/[0.02] px-2.5 py-1 text-gray-400">
              <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
              <span>Dynamic Microsoft Data</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
