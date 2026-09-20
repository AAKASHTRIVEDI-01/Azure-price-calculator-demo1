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
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      {/* Title & Currency Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-150 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-azure-50 text-azure-600 border border-azure-200">
            <Filter className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              Filter Azure Retail Pricing
            </h2>
            <p className="text-xs text-slate-500">
              Direct search across services, cloud regions, and machine SKUs
            </p>
          </div>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label htmlFor="currency-select" className="text-xs font-medium text-slate-600">
            Currency:
          </label>
          <select
            id="currency-select"
            value={params.currency}
            onChange={(e) => onChange({ ...params, currency: e.target.value })}
            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm focus:border-azure-500 focus:outline-none focus:ring-2 focus:ring-azure-500/20"
          >
            {SUPPORTED_CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
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
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Server className="h-3.5 w-3.5 text-azure-600" />
              <span>Azure Service</span>
            </label>
            <select
              value={params.serviceName}
              onChange={(e) => onChange({ ...params, serviceName: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-azure-500 focus:outline-none focus:ring-2 focus:ring-azure-500/20 transition-colors"
            >
              <option value="">All Services</option>
              {AZURE_SERVICES.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          {/* Azure Region Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-azure-600" />
              <span>Azure Region</span>
            </label>
            <select
              value={params.armRegionName}
              onChange={(e) => onChange({ ...params, armRegionName: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-azure-500 focus:outline-none focus:ring-2 focus:ring-azure-500/20 transition-colors"
            >
              <option value="all">Worldwide (All Regions)</option>
              {AZURE_REGIONS.map((r) => (
                <option key={r.armRegionName} value={r.armRegionName}>
                  {r.displayName} [{r.armRegionName}]
                </option>
              ))}
            </select>
          </div>

          {/* Product / SKU Search Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-azure-600" />
              <span>Product / SKU / Meter</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={params.skuQuery}
                onChange={(e) => onChange({ ...params, skuQuery: e.target.value })}
                placeholder="e.g. D4s v5, B2s, Hot LRS, Blob..."
                className="w-full rounded-lg border border-slate-300 bg-white pl-3.5 pr-8 py-2 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-azure-500 focus:outline-none focus:ring-2 focus:ring-azure-500/20 transition-colors"
              />
              {params.skuQuery && (
                <button
                  type="button"
                  onClick={() => onChange({ ...params, skuQuery: '' })}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Second Row: OS Filter & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-150">
          <div className="flex flex-wrap items-center gap-3">
            {/* OS Filter */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs">
              <span className="px-2 py-0.5 text-slate-500 font-medium flex items-center gap-1">
                <Terminal className="h-3 w-3 text-azure-600" />
                OS:
              </span>
              {(['all', 'linux', 'windows'] as const).map((os) => (
                <button
                  key={os}
                  type="button"
                  onClick={() => onChange({ ...params, osFilter: os })}
                  className={`rounded-md px-2.5 py-0.5 capitalize font-medium transition-all ${
                    params.osFilter === os
                      ? 'bg-azure-500 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {os}
                </button>
              ))}
            </div>

            {/* Quick Service Presets */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs">
              <span className="text-slate-400">Quick:</span>
              {['Virtual Machines', 'Storage', 'Azure SQL Database', 'Azure Kubernetes Service'].map((svc) => (
                <button
                  key={svc}
                  type="button"
                  onClick={() => handleQuickService(svc)}
                  className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors border ${
                    params.serviceName === svc
                      ? 'bg-azure-50 text-azure-700 border-azure-300'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {svc === 'Virtual Machines' ? 'VMs' : svc === 'Azure SQL Database' ? 'SQL' : svc === 'Azure Kubernetes Service' ? 'AKS' : svc}
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
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-azure-500 hover:bg-azure-600 px-5 py-2 text-xs sm:text-sm font-semibold text-white transition-all shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Searching...</span>
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

        {/* Popular SKU Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1">
          <span className="text-slate-400 text-[11px] font-medium">Popular SKUs:</span>
          {POPULAR_SKU_SUGGESTIONS.map((sku) => (
            <button
              key={sku}
              type="button"
              onClick={() => handleQuickSku(sku)}
              className={`rounded-md px-2 py-0.5 text-[11px] transition-all border ${
                params.skuQuery === sku
                  ? 'bg-azure-50 text-azure-700 border-azure-300 font-semibold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-slate-200'
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
