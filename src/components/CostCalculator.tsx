import React from 'react';
import { Calculator, Clock, Layers, Info } from 'lucide-react';
import type { CalculationConfig } from '../types/pricing';

interface CostCalculatorProps {
  config: CalculationConfig;
  onChange: (newConfig: CalculationConfig) => void;
  currencyCode: string;
}

export const CostCalculator: React.FC<CostCalculatorProps> = ({
  config,
  onChange,
}) => {
  const handleHoursChange = (val: number) => {
    onChange({ ...config, hoursPerMonth: Math.max(0, Math.min(8760, val)) });
  };

  const handleQuantityChange = (val: number) => {
    onChange({ ...config, quantity: Math.max(1, Math.min(10000, val)) });
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-ink-900/60 p-4 sm:p-5 backdrop-blur-md shadow-xl shadow-black/20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/6 pb-3.5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Estimation Parameters
            </h3>
            <p className="text-xs text-gray-400">
              Adjust operating runtime &amp; instance count to recalculate projections
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/[0.02] px-2.5 py-1 rounded-lg border border-white/5">
          <Info className="h-3.5 w-3.5 text-azure-400 flex-none" />
          <span>730 hrs = 1 standard Azure month (8,760 hrs/yr)</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Hours per Month */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-gold-400" />
            <span>Hours / Month</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="8760"
              value={config.hoursPerMonth}
              onChange={(e) => handleHoursChange(Number(e.target.value))}
              className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm text-white font-mono focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500/30"
            />
          </div>
          {/* Quick presets */}
          <div className="mt-2 flex items-center gap-1 text-[10px]">
            <button
              type="button"
              onClick={() => handleHoursChange(730)}
              className={`rounded px-1.5 py-0.5 border ${
                config.hoursPerMonth === 730
                  ? 'border-gold-500/40 bg-gold-500/20 text-gold-300'
                  : 'border-white/5 bg-white/[0.02] text-gray-400 hover:text-white'
              }`}
            >
              730h (24/7)
            </button>
            <button
              type="button"
              onClick={() => handleHoursChange(160)}
              className={`rounded px-1.5 py-0.5 border ${
                config.hoursPerMonth === 160
                  ? 'border-gold-500/40 bg-gold-500/20 text-gold-300'
                  : 'border-white/5 bg-white/[0.02] text-gray-400 hover:text-white'
              }`}
            >
              160h (Workweek)
            </button>
            <button
              type="button"
              onClick={() => handleHoursChange(24)}
              className={`rounded px-1.5 py-0.5 border ${
                config.hoursPerMonth === 24
                  ? 'border-gold-500/40 bg-gold-500/20 text-gold-300'
                  : 'border-white/5 bg-white/[0.02] text-gray-400 hover:text-white'
              }`}
            >
              24h
            </button>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-gold-400" />
            <span>Resource Quantity</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="10000"
              value={config.quantity}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm text-white font-mono focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500/30"
            />
          </div>
          {/* Quick presets */}
          <div className="mt-2 flex items-center gap-1 text-[10px]">
            {[1, 2, 5, 10].map((qty) => (
              <button
                key={qty}
                type="button"
                onClick={() => handleQuantityChange(qty)}
                className={`rounded px-1.5 py-0.5 border ${
                  config.quantity === qty
                    ? 'border-gold-500/40 bg-gold-500/20 text-gold-300'
                    : 'border-white/5 bg-white/[0.02] text-gray-400 hover:text-white'
                }`}
              >
                {qty}x
              </button>
            ))}
          </div>
        </div>

        {/* Calculation Summary Overview Box */}
        <div className="sm:col-span-2 rounded-xl border border-white/6 bg-black/30 p-3 flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
            Projection Formula
          </span>
          <div className="text-xs text-gray-300 mt-1 space-y-0.5 font-mono">
            <div>
              <span className="text-gray-500">Hourly:</span> Rate × {config.quantity} unit{config.quantity > 1 ? 's' : ''}
            </div>
            <div>
              <span className="text-gray-500">Monthly:</span> Rate × {config.hoursPerMonth}h × {config.quantity}
            </div>
            <div>
              <span className="text-gray-500">Annual:</span> Monthly Cost × 12 (or 8,760h)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
