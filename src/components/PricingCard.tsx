import React from 'react';
import { Server, MapPin, Gauge, Tag } from 'lucide-react';
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
    <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-azure-400 transition-all flex flex-col justify-between">
      <div>
        {/* Top Badges & Region */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 rounded bg-blue-50 border border-blue-200 px-2 py-0.5 text-[11px] font-semibold text-azure-700">
              <Server className="h-3 w-3 text-azure-600" />
              {item.serviceName}
            </span>

            {isSpot ? (
              <span className="inline-flex items-center rounded bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                Spot
              </span>
            ) : isLowPriority ? (
              <span className="inline-flex items-center rounded bg-purple-50 border border-purple-200 px-2 py-0.5 text-[11px] font-medium text-purple-700">
                Low Priority
              </span>
            ) : (
              <span className="inline-flex items-center rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                On-Demand
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="h-3 w-3 text-azure-600" />
            <span>{item.location}</span>
          </div>
        </div>

        {/* Product Title & SKU */}
        <div className="mt-3.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-azure-600 transition-colors leading-snug">
                {cleanSkuDisplayName(item.skuName, item.meterName)}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{item.productName}</p>
            </div>

            {/* OS Badge */}
            {item.serviceName === 'Virtual Machines' && (
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-semibold flex-none border ${
                  isWindows
                    ? 'bg-sky-50 text-sky-700 border-sky-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {isWindows ? 'Windows' : 'Linux'}
              </span>
            )}
          </div>
        </div>

        {/* Pricing Breakdown Box */}
        <div className="mt-4 rounded-lg bg-slate-50 border border-slate-200 p-3.5">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-medium text-slate-500">Unit Retail Price</span>
            <span className="text-xs text-slate-500">
              per {item.unitOfMeasure}
            </span>
          </div>

          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {formatCurrency(item.retailPrice, currencyCode)}
            </span>
            <span className="text-xs text-slate-500">
              / {item.unitOfMeasure}
            </span>
          </div>

          {/* Monthly & Annual Projection */}
          <div className="mt-3 grid grid-cols-2 gap-2.5 border-t border-slate-200 pt-2.5">
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                Monthly Est.
              </div>
              <div className="mt-0.5 text-base sm:text-lg font-bold text-azure-700">
                {formatCurrency(calc.monthlyCost, currencyCode)}
              </div>
              <div className="text-[10px] text-slate-500">
                {calc.isHourly ? `${calcConfig.hoursPerMonth}h × ${calcConfig.quantity} qty` : `flat × ${calcConfig.quantity}`}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                Annual Est.
              </div>
              <div className="mt-0.5 text-base sm:text-lg font-bold text-slate-800">
                {formatCurrency(calc.annualCost, currencyCode)}
              </div>
              <div className="text-[10px] text-slate-500">
                12 months projection
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-3.5 space-y-1 text-xs text-slate-500 border-t border-slate-100 pt-2.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-400">
              <Gauge className="h-3 w-3" />
              Meter:
            </span>
            <span className="font-medium text-slate-700 truncate max-w-[200px]" title={item.meterName}>
              {item.meterName}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-400">
              <Tag className="h-3 w-3" />
              SKU Name:
            </span>
            <span className="text-slate-700">
              {item.armSkuName || item.skuName || 'Standard'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
