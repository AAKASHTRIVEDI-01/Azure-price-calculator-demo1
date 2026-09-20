import React from 'react';
import { AlertCircle, Search, ArrowRight, Loader2, Database, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import type { AzurePriceItem, CalculationConfig } from '../types/pricing';
import { PricingCard } from './PricingCard';

interface PricingResultsProps {
  items: AzurePriceItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  nextPageLink: string | null;
  onLoadMore: () => void;
  onRetry: () => void;
  calcConfig: CalculationConfig;
  currencyCode: string;
  hasSearched: boolean;
  isCachedFallback?: boolean;
}

export const PricingResults: React.FC<PricingResultsProps> = ({
  items,
  isLoading,
  isLoadingMore,
  error,
  nextPageLink,
  onLoadMore,
  onRetry,
  calcConfig,
  currencyCode,
  hasSearched,
  isCachedFallback,
}) => {
  // Loading skeleton state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
          <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-white p-5 animate-pulse space-y-3"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-slate-200 rounded" />
                <div className="h-4 w-16 bg-slate-200 rounded" />
              </div>
              <div className="h-5 w-3/4 bg-slate-200 rounded" />
              <div className="h-4 w-1/2 bg-slate-200 rounded" />
              <div className="h-16 bg-slate-100 rounded-lg" />
              <div className="space-y-1.5 pt-2">
                <div className="h-3 w-full bg-slate-100 rounded" />
                <div className="h-3 w-4/5 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-3">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">
          Unable to Retrieve Azure Pricing
        </h3>
        <p className="max-w-md mx-auto text-sm text-slate-600 mb-5 leading-relaxed">
          {error}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg bg-azure-500 hover:bg-azure-600 px-4 py-2 text-sm font-semibold text-white transition-all shadow-sm"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Retry Search</span>
        </button>
      </div>
    );
  }

  // Empty state before any search
  if (!hasSearched) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-azure-50 text-azure-600 mb-3">
          <Search className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">
          Ready to Search Azure Pricing
        </h3>
        <p className="max-w-md mx-auto text-sm text-slate-500 leading-relaxed">
          Select an Azure service, region, and optional SKU keywords above, then click <strong>Retrieve Pricing</strong>.
        </p>
      </div>
    );
  }

  // Empty result state (query returned 0 items)
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 mb-3">
          <Database className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">
          No Matching Retail Prices Found
        </h3>
        <p className="max-w-md mx-auto text-sm text-slate-500 mb-4 leading-relaxed">
          The query returned 0 items matching your exact filter combination.
        </p>
        <ul className="text-xs text-slate-500 max-w-sm mx-auto text-left space-y-1 list-disc pl-5">
          <li>Broaden the SKU text (e.g. use "D4s" instead of "D4s v5")</li>
          <li>Set Azure Region to "Worldwide (All Regions)"</li>
          <li>Set Operating System filter to "All"</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-slate-800">
            Available Rates
          </span>
          <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
            {items.length} item{items.length > 1 ? 's' : ''} found
          </span>
          {isCachedFallback ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Verified Microsoft API Dataset
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-azure-50 border border-azure-200 px-2.5 py-0.5 text-xs font-medium text-azure-700">
              <CheckCircle2 className="h-3.5 w-3.5 text-azure-600" />
              Live Direct Connection
            </span>
          )}
        </div>
        <div className="text-xs text-slate-500">
          Amounts displayed in <strong className="text-slate-800">{currencyCode}</strong>
        </div>
      </div>

      {/* Grid of Results */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, idx) => (
          <PricingCard
            key={`${item.serviceName}-${item.armRegionName}-${item.meterName}-${item.unitPrice}-${idx}`}
            item={item}
            calcConfig={calcConfig}
            currencyCode={currencyCode}
          />
        ))}
      </div>

      {/* Pagination / Load More */}
      {nextPageLink && (
        <div className="pt-4 pb-2 text-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-6 py-2.5 text-sm font-semibold text-azure-700 transition-all shadow-sm disabled:opacity-50"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-azure-600" />
                <span>Loading Next Page...</span>
              </>
            ) : (
              <>
                <span>Load More Results</span>
                <ArrowRight className="h-4 w-4 text-azure-600" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
