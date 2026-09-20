import React from 'react';
import { Info, ExternalLink } from 'lucide-react';

export const Disclaimer: React.FC = () => {
  return (
    <footer className="mt-12 rounded-2xl border border-white/6 bg-ink-900/40 p-5 sm:p-6 backdrop-blur-md text-xs text-gray-400">
      <div className="flex items-start gap-3">
        <div className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-azure-500/10 text-azure-400 border border-azure-500/20 mt-0.5">
          <Info className="h-3.5 w-3.5" />
        </div>
        <div className="space-y-2">
          <p className="text-gray-300 leading-relaxed">
            <strong>Notice &amp; Pricing Accuracy:</strong> Prices shown are Azure public retail prices and may differ from actual billing due to discounts, reservations, savings plans, enterprise agreements (EA), Microsoft Customer Agreements (MCA), taxes, promotional credits, and other billing factors.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-500">
            <span>Data Source: <a href="https://prices.azure.com/api/retail/prices" target="_blank" rel="noopener noreferrer" className="text-azure-400 hover:underline inline-flex items-center gap-0.5">Microsoft Azure Retail Prices API <ExternalLink className="h-2.5 w-2.5" /></a></span>
            <span>•</span>
            <span>Zero Credentials Required</span>
            <span>•</span>
            <span>Calculations based on 730 hours/month (8,760 hours/year)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
