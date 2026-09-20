import type { AzurePriceResponse, SearchParams } from '../types/pricing';

const BASE_URL = 'https://prices.azure.com/api/retail/prices';

export function buildAzurePricesUrl(params: SearchParams): string {
  const filters: string[] = [];

  // Service Filter
  if (params.serviceName && params.serviceName.trim()) {
    const service = params.serviceName.trim().replace(/'/g, "''");
    filters.push(`serviceName eq '${service}'`);
  }

  // Region Filter
  if (params.armRegionName && params.armRegionName.trim() && params.armRegionName !== 'all') {
    const region = params.armRegionName.trim().replace(/'/g, "''");
    filters.push(`armRegionName eq '${region}'`);
  }

  // Price Type Filter (Default Consumption unless specified)
  if (params.priceType && params.priceType !== 'all') {
    filters.push(`priceType eq '${params.priceType}'`);
  } else {
    filters.push(`priceType eq 'Consumption'`);
  }

  // SKU / Product / Meter Query Filter
  if (params.skuQuery && params.skuQuery.trim()) {
    const q = params.skuQuery.trim().replace(/'/g, "''");
    filters.push(
      `(contains(meterName, '${q}') or contains(skuName, '${q}') or contains(productName, '${q}'))`
    );
  }

  // OS Filter for Virtual Machines
  if (params.osFilter === 'windows') {
    filters.push(`contains(productName, 'Windows')`);
  } else if (params.osFilter === 'linux') {
    filters.push(`not contains(productName, 'Windows')`);
  }

  const queryParams = new URLSearchParams();

  // Currency parameter (Azure Retail Prices API format: currencyCode='USD')
  if (params.currency && params.currency.trim()) {
    queryParams.append('currencyCode', `'${params.currency.trim()}'`);
  }

  if (filters.length > 0) {
    queryParams.append('$filter', filters.join(' and '));
  }

  return `${BASE_URL}?${queryParams.toString()}`;
}

export async function fetchAzurePrices(
  url: string,
  externalSignal?: AbortSignal
): Promise<AzurePriceResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  // Link external abort signal if provided
  if (externalSignal) {
    externalSignal.addEventListener('abort', () => controller.abort());
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error(
          'Invalid query parameters or filter syntax. Please adjust your search terms.'
        );
      } else if (response.status === 429) {
        throw new Error(
          'Too many requests to Microsoft Azure Retail Prices API. Please wait a moment and try again.'
        );
      } else if (response.status >= 500) {
        throw new Error(
          'Microsoft Azure Retail Prices API is temporarily unavailable. Please try again later.'
        );
      }
      throw new Error(`Azure API error (${response.status}): ${response.statusText}`);
    }

    const data: AzurePriceResponse = await response.json();
    return data;
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error(
        'Request timed out while contacting the Azure Retail Prices API (15s limit). Please check your internet connection or narrow your search.'
      );
    }
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('An unexpected error occurred while retrieving Azure prices.');
  } finally {
    clearTimeout(timeoutId);
  }
}
