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
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-150 pb-3.5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-azure-50 text-azure-600 border border-azure-200">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Estimation Parameters
            </h3>
            <p className="text-xs text-slate-500">
              Configure operating hours and instance count to project monthly &amp; annual budgets
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
          <Info className="h-3.5 w-3.5 text-azure-600 flex-none" />
          <span>730 hours = 1 standard Azure billing month</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Hours per Month */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-azure-600" />
            <span>Operating Hours / Month</span>
          </label>
          <div>
            <input
              type="number"
              min="0"
              max="8760"
              value={config.hoursPerMonth}
              onChange={(e) => handleHoursChange(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 shadow-sm focus:border-azure-500 focus:outline-none focus:ring-2 focus:ring-azure-500/20"
            />
          </div>
          {/* Presets */}
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => handleHoursChange(730)}
              className={`rounded px-2 py-0.5 text-[11px] border transition-colors ${
                config.hoursPerMonth === 730
                  ? 'border-azure-300 bg-azure-50 text-azure-700 font-semibold'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              730h (24/7)
            </button>
            <button
              type="button"
              onClick={() => handleHoursChange(160)}
              className={`rounded px-2 py-0.5 text-[11px] border transition-colors ${
                config.hoursPerMonth === 160
                  ? 'border-azure-300 bg-azure-50 text-azure-700 font-semibold'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              160h (Workweek)
            </button>
            <button
              type="button"
              onClick={() => handleHoursChange(24)}
              className={`rounded px-2 py-0.5 text-[11px] border transition-colors ${
                config.hoursPerMonth === 24
                  ? 'border-azure-300 bg-azure-50 text-azure-700 font-semibold'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              24h
            </button>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-azure-600" />
            <span>Instance Quantity</span>
          </label>
          <div>
            <input
              type="number"
              min="1"
              max="10000"
              value={config.quantity}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 shadow-sm focus:border-azure-500 focus:outline-none focus:ring-2 focus:ring-azure-500/20"
            />
          </div>
          {/* Presets */}
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            {[1, 2, 5, 10].map((qty) => (
              <button
                key={qty}
                type="button"
                onClick={() => handleQuantityChange(qty)}
                className={`rounded px-2 py-0.5 text-[11px] border transition-colors ${
                  config.quantity === qty
                    ? 'border-azure-300 bg-azure-50 text-azure-700 font-semibold'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {qty}x
              </button>
            ))}
          </div>
        </div>

        {/* Projection Formula */}
        <div className="sm:col-span-2 rounded-lg border border-slate-200 bg-slate-50 p-3 flex flex-col justify-between">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
            Calculation Rules
          </span>
          <div className="text-xs text-slate-700 mt-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Hourly Cost:</span>
              <span className="font-medium">Unit Rate × {config.quantity} unit{config.quantity > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Monthly Projection:</span>
              <span className="font-medium">Rate × {config.hoursPerMonth}h × {config.quantity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Annual Projection:</span>
              <span className="font-medium">Monthly Cost × 12 months</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
