import type { AzurePriceItem, CostCalculation } from '../types/pricing';

export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '$0.00';
  }

  // If amount is extremely small (e.g. storage per GB per hour: 0.0000208)
  const maximumFractionDigits = amount > 0 && amount < 0.01 ? 6 : amount < 1 ? 4 : 2;

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits,
      minimumFractionDigits: amount < 1 ? 2 : 2,
    }).format(amount);
  } catch {
    // Fallback if currency code is not recognized by browser
    return `${currencyCode} ${amount.toFixed(maximumFractionDigits)}`;
  }
}

export function isHourlyUnit(unitOfMeasure: string): boolean {
  if (!unitOfMeasure) return true;
  const unit = unitOfMeasure.toLowerCase();
  return (
    unit.includes('hour') ||
    unit.includes('/hr') ||
    unit.includes('/h') ||
    unit === '1 hr' ||
    unit === '1 hour'
  );
}

export function calculateItemCost(
  item: AzurePriceItem,
  hoursPerMonth: number = 730,
  quantity: number = 1
): CostCalculation {
  const price = item.retailPrice || 0;
  const safeQty = Math.max(1, quantity);
  const safeHours = Math.max(0, hoursPerMonth);
  const isHourly = isHourlyUnit(item.unitOfMeasure);

  if (isHourly) {
    const hourlyCost = price * safeQty;
    const monthlyCost = price * safeHours * safeQty;
    // Standard year = 8,760 hours (730h * 12)
    const annualCost = monthlyCost * 12;

    return {
      hourlyCost,
      monthlyCost,
      annualCost,
      isHourly: true,
    };
  }

  // Non-hourly (e.g. per GB/month, per 10k transactions, flat monthly fee)
  const monthlyCost = price * safeQty;
  const annualCost = monthlyCost * 12;
  const hourlyCost = safeHours > 0 ? monthlyCost / safeHours : 0;

  return {
    hourlyCost,
    monthlyCost,
    annualCost,
    isHourly: false,
  };
}

export function cleanSkuDisplayName(skuName: string, meterName: string): string {
  if (!skuName) return meterName || 'Standard';
  return skuName.replace(/^Standard_/, '').trim();
}
