export interface AzurePriceItem {
  currencyCode: string;
  tierMinimumUnits: number;
  retailPrice: number;
  unitPrice: number;
  armRegionName: string;
  location: string;
  effectiveStartDate: string;
  meterId: string;
  meterName: string;
  productId: string;
  skuId: string;
  productName: string;
  skuName: string;
  serviceName: string;
  serviceId: string;
  serviceFamily: string;
  unitOfMeasure: string;
  type: string;
  isPrimaryMeterRegion: boolean;
  armSkuName?: string;
  reservationTerm?: string;
}

export interface AzurePriceResponse {
  BillingCurrency: string;
  CustomerEntityId: string;
  CustomerEntityType: string;
  Items: AzurePriceItem[];
  NextPageLink: string | null;
  Count: number;
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
