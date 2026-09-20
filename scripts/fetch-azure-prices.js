/**
 * Script to pre-fetch authentic Microsoft Azure Retail Prices
 * from https://prices.azure.com/api/retail/prices.
 * Collects comprehensive SKU coverage across all major VM families,
 * storage types, databases, and enterprise cloud services.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIR = path.resolve(__dirname, '../public/data');
const TARGET_FILE = path.join(TARGET_DIR, 'azure-prices.json');

// Queries with pagination limits to guarantee rich SKU variety
const QUERY_CONFIGS = [
  // 1. Broad Service Queries (multi-page)
  { filter: "serviceName eq 'Virtual Machines' and priceType eq 'Consumption'", maxPages: 12 },
  { filter: "serviceName eq 'Storage' and priceType eq 'Consumption'", maxPages: 6 },
  { filter: "serviceName eq 'SQL Database' and priceType eq 'Consumption'", maxPages: 5 },
  { filter: "serviceName eq 'Azure App Service' and priceType eq 'Consumption'", maxPages: 4 },
  { filter: "serviceName eq 'Azure Kubernetes Service' and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "serviceName eq 'Azure Cosmos DB' and priceType eq 'Consumption'", maxPages: 3 },
  { filter: "serviceName eq 'Functions' and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "serviceName eq 'Bandwidth' and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "serviceName eq 'Container Instances' and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "serviceName eq 'Azure Firewall' and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "serviceName eq 'Key Vault' and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "serviceName eq 'Log Analytics' and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "serviceName eq 'Virtual Network' and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "serviceName eq 'Azure Database for PostgreSQL' and priceType eq 'Consumption'", maxPages: 3 },
  { filter: "serviceName eq 'Azure Database for MySQL' and priceType eq 'Consumption'", maxPages: 3 },
  { filter: "serviceName eq 'Container Registry' and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "serviceName eq 'API Management' and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "serviceName eq 'Application Gateway' and priceType eq 'Consumption'", maxPages: 2 },

  // 2. Specific SKU Family Targets (Guarantees popular SKUs exist in all regions)
  // B-series (Burstable VMs)
  { filter: "contains(meterName, 'B1s') and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "contains(meterName, 'B1ms') and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "contains(meterName, 'B2s') and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "contains(meterName, 'B2ms') and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "contains(meterName, 'B4ms') and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "contains(meterName, 'B8ms') and priceType eq 'Consumption'", maxPages: 2 },

  // D-series (General Purpose)
  { filter: "contains(meterName, 'D2s v5') and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "contains(meterName, 'D4s v5') and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "contains(meterName, 'D8s v5') and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "contains(meterName, 'D16s v5') and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "contains(meterName, 'D32s v5') and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "contains(meterName, 'D2s v4') and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "contains(meterName, 'D4s v4') and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "contains(meterName, 'D8s v4') and priceType eq 'Consumption'", maxPages: 2 },

  // E-series (Memory Optimized)
  { filter: "contains(meterName, 'E2s v5') and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "contains(meterName, 'E4s v5') and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "contains(meterName, 'E8s v5') and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "contains(meterName, 'E16s v5') and priceType eq 'Consumption'", maxPages: 2 },

  // F-series (Compute Optimized)
  { filter: "contains(meterName, 'F2s v2') and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "contains(meterName, 'F4s v2') and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "contains(meterName, 'F8s v2') and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "contains(meterName, 'F16s v2') and priceType eq 'Consumption'", maxPages: 2 },

  // N-series (GPU Workloads)
  { filter: "contains(meterName, 'NV6') and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "contains(meterName, 'NV12') and priceType eq 'Consumption'", maxPages: 2 },
  { filter: "contains(meterName, 'NC6') and priceType eq 'Consumption'", maxPages: 2 },
];

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        return await res.json();
      }
      console.warn(`Request failed (${res.status}), retrying ${i + 1}/${retries}...`);
    } catch (err) {
      console.warn(`Request error (${err.message}), retrying ${i + 1}/${retries}...`);
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return null;
}

async function main() {
  console.log('Fetching comprehensive Azure retail prices from Microsoft...');
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  const allItems = [];
  const seenKeys = new Set();

  for (let i = 0; i < QUERY_CONFIGS.length; i++) {
    const config = QUERY_CONFIGS[i];
    let nextUrl = `https://prices.azure.com/api/retail/prices?$filter=${encodeURIComponent(config.filter)}`;
    let page = 0;

    console.log(`[${i + 1}/${QUERY_CONFIGS.length}] Target: ${config.filter.slice(0, 60)}...`);

    while (nextUrl && page < config.maxPages) {
      page++;
      const data = await fetchWithRetry(nextUrl);
      if (!data || !Array.isArray(data.Items) || data.Items.length === 0) {
        break;
      }

      let added = 0;
      for (const item of data.Items) {
        const key = `${item.skuId || item.meterId}-${item.armRegionName}-${item.meterName}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          added++;
          allItems.push({
            currencyCode: item.currencyCode || 'USD',
            retailPrice: item.retailPrice || 0,
            unitPrice: item.unitPrice || 0,
            armRegionName: item.armRegionName || '',
            location: item.location || '',
            meterName: item.meterName || '',
            productName: item.productName || '',
            skuName: item.skuName || '',
            serviceName: item.serviceName || '',
            unitOfMeasure: item.unitOfMeasure || '',
            type: item.type || 'Consumption',
            armSkuName: item.armSkuName || item.skuName || '',
          });
        }
      }

      console.log(`   Page ${page}: got ${data.Items.length} items (${added} unique added, total: ${allItems.length})`);
      nextUrl = data.NextPageLink || null;
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  console.log(`\nCollection complete! Total unique items: ${allItems.length}`);

  const output = {
    updatedAt: new Date().toISOString(),
    source: 'https://prices.azure.com/api/retail/prices',
    count: allItems.length,
    items: allItems,
  };

  fs.writeFileSync(TARGET_FILE, JSON.stringify(output), 'utf8');
  const sizeMb = (fs.statSync(TARGET_FILE).size / (1024 * 1024)).toFixed(2);
  console.log(`Successfully wrote ${allItems.length} prices to ${TARGET_FILE} (${sizeMb} MB)`);
}

main().catch((err) => {
  console.error('Fatal error fetching Azure prices:', err);
  process.exit(1);
});
