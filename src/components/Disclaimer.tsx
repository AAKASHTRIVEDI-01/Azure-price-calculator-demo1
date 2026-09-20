import React from 'react';
import { Info, ExternalLink } from 'lucide-react';

export const Disclaimer: React.FC = () => {
  return (
    <footer className="mt-8 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 text-xs text-slate-500 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-azure-50 text-azure-600 border border-azure-200 mt-0.5">
          <Info className="h-3.5 w-3.5" />
        </div>
        <div className="space-y-1.5">
          <p className="text-slate-600 leading-relaxed">
            <strong>Official Pricing Notice:</strong> All values are Azure public retail rates retrieved directly from Microsoft. Final billing may vary based on active Enterprise Agreements, Microsoft Customer Agreements, reservation terms, regional taxes, and currency exchange rates.
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
            <span>Data Source: <a href="https://prices.azure.com/api/retail/prices" target="_blank" rel="noopener noreferrer" className="text-azure-600 hover:underline inline-flex items-center gap-0.5">Microsoft Azure Retail Prices API <ExternalLink className="h-2.5 w-2.5" /></a></span>
            <span>•</span>
            <span>$0 Cost Application</span>
            <span>•</span>
            <span>Calculations assume 730 hours/month (8,760 hours/year)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
