import React from 'react';
import { Cloud, ShieldCheck, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-azure-500 text-white shadow-md sticky top-0 z-30">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-white/15 text-white">
              <Cloud className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Azure Cost Finder
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Active API
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100">
                Current Microsoft Azure retail rates &amp; instant cost calculator
              </p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1 text-white border border-white/15">
              <Zap className="h-3.5 w-3.5 text-amber-300" />
              <span>100% Free · $0 Cost</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1 text-white border border-white/15">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
              <span>No Azure Account Needed</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
