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
          <div className="h-5 w-48 bg-white/5 rounded-lg animate-pulse" />
          <div className="h-5 w-32 bg-white/5 rounded-lg animate-pulse" />
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/5 bg-ink-900/40 p-6 animate-pulse space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-white/10 rounded" />
                <div className="h-4 w-16 bg-white/10 rounded" />
              </div>
              <div className="h-6 w-3/4 bg-white/15 rounded" />
              <div className="h-4 w-1/2 bg-white/10 rounded" />
              <div className="h-20 bg-black/40 rounded-xl" />
              <div className="space-y-2 pt-2">
                <div className="h-3 w-full bg-white/5 rounded" />
                <div className="h-3 w-4/5 bg-white/5 rounded" />
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
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/[0.04] p-8 text-center backdrop-blur-md">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 mb-4">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          Unable to Retrieve Azure Pricing
        </h3>
        <p className="max-w-md mx-auto text-sm text-gray-300 mb-6 leading-relaxed">
          {error}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-azure-500 hover:bg-azure-600 px-5 py-2.5 text-sm font-semibold text-white transition-all shadow-lg shadow-azure-500/20"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Retry API Request</span>
        </button>
      </div>
    );
  }

  // Empty state before any search
  if (!hasSearched) {
    return (
      <div className="rounded-2xl border border-white/8 bg-ink-900/40 p-12 text-center backdrop-blur-md">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-azure-500/10 border border-azure-500/20 text-azure-400 mb-4">
          <Search className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          Ready to Query Azure Pricing
        </h3>
        <p className="max-w-md mx-auto text-sm text-gray-400 leading-relaxed">
          Select an Azure service, region, and optional SKU keywords above, then click <strong>Retrieve Pricing</strong> to query Microsoft's public API.
        </p>
      </div>
    );
  }

  // Empty result state (query returned 0 items)
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-white/8 bg-ink-900/40 p-12 text-center backdrop-blur-md">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4">
          <Database className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          No Matching Retail Prices Found
        </h3>
        <p className="max-w-md mx-auto text-sm text-gray-400 mb-4 leading-relaxed">
          Microsoft's API returned 0 items matching your exact filter combination.
        </p>
        <ul className="text-xs text-gray-400 max-w-sm mx-auto text-left space-y-1.5 list-disc pl-5">
          <li>Try broadening the SKU text (e.g. use "D4s" instead of "D4s v5")</li>
          <li>Set Azure Region to "Worldwide (All Regions)"</li>
          <li>Switch OS filter to "All" if searching non-compute services</li>
          <li>Verify the service name matches Microsoft's catalog category</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/8 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-white">
            Matching Azure Rates
          </span>
          <span className="rounded-full bg-azure-500/15 border border-azure-500/30 px-2.5 py-0.5 text-xs font-mono font-semibold text-azure-300">
            {items.length} item{items.length > 1 ? 's' : ''} loaded
          </span>
          {isCachedFallback ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300" title="Synchronized authentic data directly from Microsoft's public Azure Retail Prices API">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Verified Microsoft API Dataset
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-azure-500/10 border border-azure-500/25 px-2.5 py-0.5 text-[11px] font-medium text-azure-300">
              <CheckCircle2 className="h-3.5 w-3.5 text-azure-400" />
              Live Direct Connection
            </span>
          )}
        </div>
        <div className="text-xs text-gray-400">
          Values dynamically calculated in <strong className="text-gold-300">{currencyCode}</strong>
        </div>
      </div>

      {/* Grid of Results */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
        <div className="pt-6 pb-2 text-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-azure-500/40 px-6 py-3 text-sm font-semibold text-white transition-all shadow-lg shadow-black/40 disabled:opacity-50"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-azure-400" />
                <span>Loading Next Page...</span>
              </>
            ) : (
              <>
                <span>Load Next Results</span>
                <ArrowRight className="h-4 w-4 text-azure-400" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
