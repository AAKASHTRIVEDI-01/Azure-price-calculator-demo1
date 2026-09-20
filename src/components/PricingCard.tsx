import React from 'react';
import { Server, MapPin, Gauge, Calendar, Tag } from 'lucide-react';
import type { AzurePriceItem, CalculationConfig } from '../types/pricing';
import { formatCurrency, calculateItemCost, cleanSkuDisplayName } from '../utils/formatters';

interface PricingCardProps {
  item: AzurePriceItem;
  calcConfig: CalculationConfig;
  currencyCode: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  item,
  calcConfig,
  currencyCode,
}) => {
  const calc = calculateItemCost(item, calcConfig.hoursPerMonth, calcConfig.quantity);
  const isWindows = item.productName.toLowerCase().includes('windows');
  const isSpot = item.meterName.toLowerCase().includes('spot') || item.skuName.toLowerCase().includes('spot');
  const isLowPriority = item.meterName.toLowerCase().includes('low priority') || item.skuName.toLowerCase().includes('low priority');

  return (
    <div className="group rounded-2xl border border-white/8 bg-ink-900/70 p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:border-azure-500/40 hover:bg-ink-850 hover:shadow-[0_0_28px_rgba(0,120,212,0.12)] flex flex-col justify-between">
      <div>
        {/* Top Badges & Meta */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/6 pb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-azure-500/10 border border-azure-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-azure-300">
              <Server className="h-3 w-3" />
              {item.serviceName}
            </span>

            {isSpot ? (
              <span className="inline-flex items-center rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                Spot Instance
              </span>
            ) : isLowPriority ? (
              <span className="inline-flex items-center rounded-md bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
                Low Priority
              </span>
            ) : (
              <span className="inline-flex items-center rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                Standard On-Demand
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-gray-400">
            <MapPin className="h-3 w-3 text-azure-400" />
            <span>{item.location} ({item.armRegionName})</span>
          </div>
        </div>

        {/* Product Title & SKU */}
        <div className="mt-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white group-hover:text-azure-300 transition-colors leading-snug">
                {cleanSkuDisplayName(item.skuName, item.meterName)}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">{item.productName}</p>
            </div>

            {/* OS Badge */}
            {item.serviceName === 'Virtual Machines' && (
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-semibold flex-none ${
                  isWindows
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {isWindows ? 'Windows' : 'Linux'}
              </span>
            )}
          </div>
        </div>

        {/* Calculation Cost Showcase Card */}
        <div className="mt-5 rounded-xl border border-white/6 bg-black/40 p-3.5">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-gray-400">Unit Retail Price</span>
            <span className="font-mono text-xs text-gray-300">
              per {item.unitOfMeasure}
            </span>
          </div>

          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {formatCurrency(item.retailPrice, currencyCode)}
            </span>
            <span className="text-xs text-gray-400">
              / {item.unitOfMeasure}
            </span>
          </div>

          {/* Monthly & Annual Projection Grid */}
          <div className="mt-3.5 grid grid-cols-2 gap-2.5 border-t border-white/6 pt-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                Estimated Monthly
              </div>
              <div className="mt-0.5 text-base sm:text-lg font-bold text-gold-300 font-mono">
                {formatCurrency(calc.monthlyCost, currencyCode)}
              </div>
              <div className="text-[10px] text-gray-500">
                {calc.isHourly ? `@ ${calcConfig.hoursPerMonth}h × ${calcConfig.quantity} qty` : `flat × ${calcConfig.quantity} qty`}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                Estimated Annual
              </div>
              <div className="mt-0.5 text-base sm:text-lg font-bold text-emerald-400 font-mono">
                {formatCurrency(calc.annualCost, currencyCode)}
              </div>
              <div className="text-[10px] text-gray-500">
                12-month projection
              </div>
            </div>
          </div>
        </div>

        {/* Technical Meter Details */}
        <div className="mt-4 space-y-1.5 text-[11px] text-gray-400">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-gray-500">
              <Gauge className="h-3 w-3" />
              Meter Name:
            </span>
            <span className="font-medium text-gray-300 truncate max-w-[200px]" title={item.meterName}>
              {item.meterName}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-gray-500">
              <Tag className="h-3 w-3" />
              ARM SKU:
            </span>
            <span className="font-mono text-gray-300">
              {item.armSkuName || item.skuName || 'Standard'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-gray-500">
              <Calendar className="h-3 w-3" />
              Rate Effective Date:
            </span>
            <span className="text-gray-400">
              {item.effectiveStartDate
                ? new Date(item.effectiveStartDate).toLocaleDateString()
                : 'Active Tier'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
