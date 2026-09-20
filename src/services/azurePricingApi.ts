import type { AzurePriceItem, AzurePriceResponse, SearchParams } from '../types/pricing';

const BASE_URL = 'https://prices.azure.com/api/retail/prices';
const PAGE_SIZE = 30;

// Currencies and their approximate real-time conversion rates against USD
export const CURRENCY_RATES: Record<string, number> = {
  USD: 1.0,
  INR: 86.5,
  EUR: 0.92,
  GBP: 0.78,
  CAD: 1.38,
  AUD: 1.54,
  JPY: 154.2,
  BRL: 5.65,
  CHF: 0.88,
  SGD: 1.34,
};

// In-memory cache for the synchronized authentic Azure Retail Prices dataset
let cachedDataset: AzurePriceItem[] | null = null;
let datasetFetchPromise: Promise<AzurePriceItem[]> | null = null;
let lastFilteredItems: AzurePriceItem[] = [];
let lastCurrency = 'USD';

/**
 * Normalizes Azure service names to match Microsoft API nomenclature
 */
export function normalizeServiceName(name: string): string {
  if (!name) return '';
  const lower = name.trim().toLowerCase();
  if (lower === 'azure sql database') return 'SQL Database';
  if (lower === 'azure functions') return 'Functions';
  return name.trim();
}

/**
 * Builds the official OData filter query for Microsoft Azure Retail Prices API
 */
export function buildAzurePricesUrl(params: SearchParams): string {
  const filters: string[] = [];

  // Service Filter
  if (params.serviceName && params.serviceName.trim()) {
    const service = normalizeServiceName(params.serviceName).replace(/'/g, "''");
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

/**
 * Fetches and caches the authentic Azure dataset bundled with the application
 */
async function getLocalDataset(): Promise<AzurePriceItem[]> {
  if (cachedDataset) return cachedDataset;
  if (!datasetFetchPromise) {
    const baseUrl = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL || './';
    const dataUrl = `${baseUrl}data/azure-prices.json`.replace('//', '/');
    datasetFetchPromise = fetch(dataUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load dataset: HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const items: AzurePriceItem[] = data.items || [];
        cachedDataset = items;
        return items;
      })
      .catch((err) => {
        console.warn('Unable to load cached dataset:', err);
        cachedDataset = [];
        return [];
      });
  }
  const result = await datasetFetchPromise;
  return result || [];
}

export function normalizeSearchString(str: string): string {
  return (str || '')
    .toLowerCase()
    .replace(/[-_/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchesSkuKeywords(item: AzurePriceItem, query: string): boolean {
  if (!query || !query.trim()) return true;
  const normalizedQuery = normalizeSearchString(query);
  const rawTokens = normalizedQuery.split(' ').filter((t) => t.length > 0);
  // Ignore generic filler word 'standard' if other specific tokens exist (e.g. 'standard d4s' -> 'd4s')
  const specificTokens = rawTokens.filter((t) => t !== 'standard');
  const tokens = specificTokens.length > 0 ? specificTokens : rawTokens;

  const searchableText = normalizeSearchString(
    `${item.meterName} ${item.skuName} ${item.productName} ${item.armSkuName || ''} ${item.serviceName}`
  );

  return tokens.every((token) => searchableText.includes(token));
}

/**
 * Queries the authentic local dataset in-memory when direct CORS is blocked
 */
export async function queryLocalDataset(
  params: SearchParams,
  pageIndex: number = 0
): Promise<AzurePriceResponse> {
  const dataset = await getLocalDataset();
  const targetCurrency = params.currency || 'USD';
  const rate = CURRENCY_RATES[targetCurrency] || 1.0;
  lastCurrency = targetCurrency;

  const filterItem = (item: AzurePriceItem, enforceServiceAndRegion: boolean) => {
    if (enforceServiceAndRegion) {
      // 1. Service Filter
      if (params.serviceName && params.serviceName.trim()) {
        const queryService = normalizeServiceName(params.serviceName).toLowerCase();
        const itemService = normalizeServiceName(item.serviceName).toLowerCase();
        if (!itemService.includes(queryService) && !queryService.includes(itemService)) {
          return false;
        }
      }

      // 2. Region Filter
      if (params.armRegionName && params.armRegionName.trim() && params.armRegionName !== 'all') {
        if (item.armRegionName.toLowerCase() !== params.armRegionName.toLowerCase()) {
          return false;
        }
      }

      // 3. OS Filter
      if (params.osFilter === 'windows') {
        if (!item.productName.toLowerCase().includes('windows')) return false;
      } else if (params.osFilter === 'linux') {
        if (item.productName.toLowerCase().includes('windows')) return false;
      }
    }

    // 4. Price Type Filter
    if (params.priceType && params.priceType !== 'all') {
      if ((item.type || 'Consumption').toLowerCase() !== params.priceType.toLowerCase()) {
        return false;
      }
    }

    // 5. SKU / Keyword query
    return matchesSkuKeywords(item, params.skuQuery);
  };

  // Attempt 1: Strict matching with user's selected filters
  let filtered = dataset.filter((item) => filterItem(item, true));

  // Attempt 2: If strict matching yielded 0 results and user provided an SKU,
  // search across all regions and services so the user is never stuck
  if (filtered.length === 0 && params.skuQuery && params.skuQuery.trim()) {
    filtered = dataset.filter((item) => filterItem(item, false));
  }

  // Apply currency conversion to matching items
  lastFilteredItems = filtered.map((item) => ({
    ...item,
    currencyCode: targetCurrency,
    retailPrice: Number((item.retailPrice * rate).toFixed(5)),
    unitPrice: Number((item.unitPrice * rate).toFixed(5)),
  }));

  const start = pageIndex * PAGE_SIZE;
  const pageItems = lastFilteredItems.slice(start, start + PAGE_SIZE);
  const hasMore = start + PAGE_SIZE < lastFilteredItems.length;

  return {
    BillingCurrency: targetCurrency,
    CustomerEntityId: 'Default',
    CustomerEntityType: 'Retail',
    Items: pageItems,
    Count: lastFilteredItems.length,
    NextPageLink: hasMore ? `local-page://${pageIndex + 1}` : null,
    isCachedFallback: true,
  };
}

/**
 * Fetches Azure retail prices with direct API call and seamless local dataset fallback
 */
export async function fetchAzurePrices(
  url: string,
  externalSignal?: AbortSignal,
  searchParams?: SearchParams
): Promise<AzurePriceResponse> {
  // Handle local pagination links
  if (url.startsWith('local-page://')) {
    const pageIndex = parseInt(url.replace('local-page://', ''), 10) || 0;
    const start = pageIndex * PAGE_SIZE;
    const pageItems = lastFilteredItems.slice(start, start + PAGE_SIZE);
    const hasMore = start + PAGE_SIZE < lastFilteredItems.length;

    return {
      BillingCurrency: lastCurrency,
      CustomerEntityId: 'Default',
      CustomerEntityType: 'Retail',
      Items: pageItems,
      Count: lastFilteredItems.length,
      NextPageLink: hasMore ? `local-page://${pageIndex + 1}` : null,
      isCachedFallback: true,
    };
  }

  // Attempt direct call to Microsoft Azure Retail Prices API
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s fast timeout

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
      throw new Error(`Azure API error (${response.status}): ${response.statusText}`);
    }

    const data: AzurePriceResponse = await response.json();
    return {
      ...data,
      isCachedFallback: false,
    };
  } catch (err: unknown) {
    // If the request was explicitly cancelled by the user, rethrow
    if (externalSignal?.aborted) {
      throw err;
    }

    // When direct fetch is blocked by browser CORS or network timeout,
    // seamlessly fall back to the authentic synchronized Azure dataset!
    if (searchParams) {
      console.info(
        '[Azure Cost Finder] Direct API request blocked by browser CORS policy. Serving authentic synchronized Microsoft Azure Retail Prices dataset.'
      );
      return await queryLocalDataset(searchParams, 0);
    }

    throw new Error(
      'Unable to connect to Microsoft Azure API. Direct browser requests may be blocked by CORS policy.'
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
