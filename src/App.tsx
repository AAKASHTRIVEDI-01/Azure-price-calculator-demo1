import { useState, useEffect, useCallback, useRef } from 'react';
import type { AzurePriceItem, SearchParams, CalculationConfig } from './types/pricing';
import { buildAzurePricesUrl, fetchAzurePrices } from './services/azurePricingApi';
import { Header } from './components/Header';
import { SearchFilters } from './components/SearchFilters';
import { CostCalculator } from './components/CostCalculator';
import { PricingResults } from './components/PricingResults';
import { Disclaimer } from './components/Disclaimer';

const INITIAL_SEARCH_PARAMS: SearchParams = {
  serviceName: 'Virtual Machines',
  armRegionName: 'centralindia',
  skuQuery: 'D4s v5',
  osFilter: 'linux',
  currency: 'USD',
  priceType: 'Consumption',
};

const INITIAL_CALC_CONFIG: CalculationConfig = {
  hoursPerMonth: 730,
  quantity: 1,
};

export default function App() {
  const [params, setParams] = useState<SearchParams>(INITIAL_SEARCH_PARAMS);
  const [calcConfig, setCalcConfig] = useState<CalculationConfig>(INITIAL_CALC_CONFIG);
  const [items, setItems] = useState<AzurePriceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPageLink, setNextPageLink] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [isCachedFallback, setIsCachedFallback] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSearch = useCallback(async () => {
    // Abort previous in-flight request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const url = buildAzurePricesUrl(params);
      const data = await fetchAzurePrices(url, controller.signal, params);
      setItems(data.Items || []);
      setNextPageLink(data.NextPageLink || null);
      setIsCachedFallback(Boolean(data.isCachedFallback));
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return; // Ignore aborted requests
      }
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch pricing data from Microsoft Azure Retail Prices API.');
      }
      setItems([]);
      setNextPageLink(null);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  const handleLoadMore = async () => {
    if (!nextPageLink || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const data = await fetchAzurePrices(nextPageLink, undefined, params);
      setItems((prev) => [...prev, ...(data.Items || [])]);
      setNextPageLink(data.NextPageLink || null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Failed to load additional results: ${err.message}`);
      }
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleReset = () => {
    setParams(INITIAL_SEARCH_PARAMS);
    setCalcConfig(INITIAL_CALC_CONFIG);
    setError(null);
  };

  // Perform initial query on mount so user sees live prices immediately
  useEffect(() => {
    handleSearch();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-ink-950 text-gray-100 flex flex-col font-sans selection:bg-azure-500/30 selection:text-white relative">
      {/* Background ambient radial lights */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,120,212,0.12),transparent)]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_500px_at_80%_80%,rgba(212,175,55,0.05),transparent)]" />

      {/* Main App Container */}
      <div className="relative z-10 flex-1 flex flex-col">
        <Header />

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 flex-1 w-full">
          {/* Section 1: Filters */}
          <SearchFilters
            params={params}
            onChange={setParams}
            onSearch={handleSearch}
            onReset={handleReset}
            isLoading={isLoading}
          />

          {/* Section 2: Interactive Cost Calculator Settings */}
          <CostCalculator
            config={calcConfig}
            onChange={setCalcConfig}
            currencyCode={params.currency}
          />

          {/* Section 3: Pricing Results */}
          <PricingResults
            items={items}
            isLoading={isLoading}
            isLoadingMore={isLoadingMore}
            error={error}
            nextPageLink={nextPageLink}
            onLoadMore={handleLoadMore}
            onRetry={handleSearch}
            calcConfig={calcConfig}
            currencyCode={params.currency}
            hasSearched={hasSearched}
            isCachedFallback={isCachedFallback}
          />

          {/* Section 4: Public Pricing Disclaimer */}
          <Disclaimer />
        </main>
      </div>
    </div>
  );
}
