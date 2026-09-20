export interface AzurePriceItem {
  currencyCode: string;
  retailPrice: number;
  unitPrice: number;
  armRegionName: string;
  location: string;
  meterName: string;
  productName: string;
  skuName: string;
  serviceName: string;
  unitOfMeasure: string;
  type: string;
  armSkuName?: string;
  tierMinimumUnits?: number;
  effectiveStartDate?: string;
  meterId?: string;
  productId?: string;
  skuId?: string;
  serviceId?: string;
  serviceFamily?: string;
  isPrimaryMeterRegion?: boolean;
  reservationTerm?: string;
}

export interface AzurePriceResponse {
  BillingCurrency: string;
  CustomerEntityId?: string;
  CustomerEntityType?: string;
  Items: AzurePriceItem[];
  NextPageLink: string | null;
  Count: number;
  isCachedFallback?: boolean;
}

export interface SearchParams {
  serviceName: string;
  armRegionName: string;
  skuQuery: string;
  osFilter: 'all' | 'linux' | 'windows';
  currency: string;
  priceType: 'Consumption' | 'Reservation' | 'all';
}

export interface CalculationConfig {
  hoursPerMonth: number;
  quantity: number;
}

export interface CostCalculation {
  hourlyCost: number;
  monthlyCost: number;
  annualCost: number;
  isHourly: boolean;
}
