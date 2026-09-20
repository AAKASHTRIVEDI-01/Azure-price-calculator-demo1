import React from 'react';
import { Search, RotateCcw, Filter, Globe, Server, Tag, Terminal } from 'lucide-react';
import type { SearchParams } from '../types/pricing';
import {
  AZURE_SERVICES,
  AZURE_REGIONS,
  SUPPORTED_CURRENCIES,
  POPULAR_SKU_SUGGESTIONS,
} from '../utils/azureConstants';

interface SearchFiltersProps {
  params: SearchParams;
  onChange: (newParams: SearchParams) => void;
  onSearch: () => void;
  onReset: () => void;
  isLoading: boolean;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  params,
  onChange,
  onSearch,
  onReset,
  isLoading,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  const handleQuickSku = (sku: string) => {
    onChange({ ...params, skuQuery: sku });
  };

  const handleQuickService = (service: string) => {
    onChange({ ...params, serviceName: service });
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-ink-900/60 p-5 sm:p-6 backdrop-blur-md shadow-xl shadow-black/20">
      <div className="flex items-center justify-between border-b border-white/6 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-azure-500/10 border border-azure-500/30 text-azure-400">
            <Filter className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              Price Query Criteria
            </h2>
            <p className="text-xs text-gray-400">
              Filter Microsoft's public catalog by service, geography, and machine tier
            </p>
          </div>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="currency-select" className="text-xs text-gray-400 hidden sm:inline">
            Currency:
          </label>
          <select
            id="currency-select"
            value={params.currency}
            onChange={(e) => onChange({ ...params, currency: e.target.value })}
            className="rounded-lg border border-white/10 bg-black/40 px-2.5 py-1 text-xs font-semibold text-gold-300 focus:border-azure-500 focus:outline-none"
          >
            {SUPPORTED_CURRENCIES.map((c) => (
              <option key={c.code} value={c.code} className="bg-ink-900 text-white">
                {c.code} ({c.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Azure Service Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Server className="h-3.5 w-3.5 text-azure-400" />
              <span>Azure Service</span>
            </label>
            <select
              value={params.serviceName}
              onChange={(e) => onChange({ ...params, serviceName: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-sm text-white focus:border-azure-500 focus:outline-none focus:ring-1 focus:ring-azure-500/30 transition-colors"
            >
              <option value="" className="bg-ink-900">All Services</option>
              {AZURE_SERVICES.map((s) => (
                <option key={s.name} value={s.name} className="bg-ink-900">
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          {/* Azure Region Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-azure-400" />
              <span>Azure Region</span>
            </label>
            <select
              value={params.armRegionName}
              onChange={(e) => onChange({ ...params, armRegionName: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-sm text-white focus:border-azure-500 focus:outline-none focus:ring-1 focus:ring-azure-500/30 transition-colors"
            >
              <option value="all" className="bg-ink-900">Worldwide (All Regions)</option>
              {AZURE_REGIONS.map((r) => (
                <option key={r.armRegionName} value={r.armRegionName} className="bg-ink-900">
                  {r.displayName} [{r.armRegionName}]
                </option>
              ))}
            </select>
          </div>

          {/* Product / SKU Search Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-azure-400" />
              <span>Product / SKU / Meter</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={params.skuQuery}
                onChange={(e) => onChange({ ...params, skuQuery: e.target.value })}
                placeholder="e.g. D4s v5, B2s, Hot LRS, Blob..."
                className="w-full rounded-xl border border-white/10 bg-black/50 pl-3.5 pr-8 py-2.5 text-sm text-white placeholder-gray-500 focus:border-azure-500 focus:outline-none focus:ring-1 focus:ring-azure-500/30 transition-colors"
              />
              {params.skuQuery && (
                <button
                  type="button"
                  onClick={() => onChange({ ...params, skuQuery: '' })}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Second Row: OS Filter & Popular Quick Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
          <div className="flex flex-wrap items-center gap-3">
            {/* OS Filter */}
            <div className="flex items-center gap-1 bg-black/40 border border-white/8 rounded-xl p-1 text-xs">
              <span className="px-2 py-1 text-gray-400 font-medium flex items-center gap-1">
                <Terminal className="h-3 w-3 text-azure-400" />
                OS:
              </span>
              {(['all', 'linux', 'windows'] as const).map((os) => (
                <button
                  key={os}
                  type="button"
                  onClick={() => onChange({ ...params, osFilter: os })}
                  className={`rounded-lg px-2.5 py-1 capitalize font-medium transition-all ${
                    params.osFilter === os
                      ? 'bg-azure-500/20 text-azure-300 border border-azure-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {os}
                </button>
              ))}
            </div>

            {/* Quick Service Presets */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs">
              <span className="text-gray-500">Quick:</span>
              {['Virtual Machines', 'Storage', 'Azure SQL Database', 'Azure Kubernetes Service'].map((svc) => (
                <button
                  key={svc}
                  type="button"
                  onClick={() => handleQuickService(svc)}
                  className={`rounded-md px-2 py-0.5 text-[11px] transition-colors ${
                    params.serviceName === svc
                      ? 'bg-azure-500/20 text-azure-300 border border-azure-500/30'
                      : 'bg-white/[0.02] text-gray-400 hover:text-gray-200 border border-white/5'
                  }`}
                >
                  {svc === 'Virtual Machines' ? 'VMs' : svc === 'Azure SQL Database' ? 'Azure SQL' : svc === 'Azure Kubernetes Service' ? 'AKS' : svc}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={onReset}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-2 text-xs font-medium text-gray-300 hover:bg-white/[0.05] hover:text-white transition-colors disabled:opacity-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-azure-500/50 bg-azure-500 px-5 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-azure-600 transition-all shadow-lg shadow-azure-500/20 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Querying Azure API...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Retrieve Pricing</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* SKU Suggestions Bar */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1">
          <span className="text-gray-500 text-[11px]">Popular SKUs:</span>
          {POPULAR_SKU_SUGGESTIONS.map((sku) => (
            <button
              key={sku}
              type="button"
              onClick={() => handleQuickSku(sku)}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-mono transition-all ${
                params.skuQuery === sku
                  ? 'bg-azure-500/20 text-azure-300 border border-azure-500/40'
                  : 'bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.06] border border-white/5'
              }`}
            >
              {sku}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};
