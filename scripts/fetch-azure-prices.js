/**
 * Build script to pre-fetch authentic Microsoft Azure Retail Prices
 * from https://prices.azure.com/api/retail/prices.
 * This runs at build time on the server/CI where CORS is not enforced by browsers.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIR = path.resolve(__dirname, '../public/data');
const TARGET_FILE = path.join(TARGET_DIR, 'azure-prices.json');

// Queries designed to fetch broad coverage across top services, popular SKUs, and major regions
const QUERIES = [
  // Popular VM SKUs across all regions
  "contains(meterName, 'D4s v5') and priceType eq 'Consumption'",
  "contains(meterName, 'D2s v5') and priceType eq 'Consumption'",
  "contains(meterName, 'B2s') and priceType eq 'Consumption'",
  "contains(meterName, 'B4ms') and priceType eq 'Consumption'",
  "contains(meterName, 'E4s v5') and priceType eq 'Consumption'",
  "contains(meterName, 'F4s v2') and priceType eq 'Consumption'",
  // Regional VM queries for high traffic regions
  "serviceName eq 'Virtual Machines' and armRegionName eq 'centralindia' and priceType eq 'Consumption'",
  "serviceName eq 'Virtual Machines' and armRegionName eq 'eastus' and priceType eq 'Consumption'",
  "serviceName eq 'Virtual Machines' and armRegionName eq 'westeurope' and priceType eq 'Consumption'",
  "serviceName eq 'Virtual Machines' and armRegionName eq 'southeastasia' and priceType eq 'Consumption'",
  // Key Azure Services
  "serviceName eq 'Storage' and priceType eq 'Consumption'",
  "serviceName eq 'Azure App Service' and priceType eq 'Consumption'",
  "serviceName eq 'SQL Database' and priceType eq 'Consumption'",
  "serviceName eq 'Azure Kubernetes Service' and priceType eq 'Consumption'",
  "serviceName eq 'Azure Cosmos DB' and priceType eq 'Consumption'",
  "serviceName eq 'Functions' and priceType eq 'Consumption'",
  "serviceName eq 'Bandwidth' and priceType eq 'Consumption'",
  "serviceName eq 'Container Instances' and priceType eq 'Consumption'",
  "serviceName eq 'Azure Firewall' and priceType eq 'Consumption'",
  "serviceName eq 'Key Vault' and priceType eq 'Consumption'",
  "serviceName eq 'Log Analytics' and priceType eq 'Consumption'",
  "serviceName eq 'Virtual Network' and priceType eq 'Consumption'",
  "serviceName eq 'Cognitive Services' and priceType eq 'Consumption'",
  "serviceName eq 'Azure DevOps' and priceType eq 'Consumption'",
  "serviceName eq 'Container Registry' and priceType eq 'Consumption'",
  "serviceName eq 'Azure Database for PostgreSQL' and priceType eq 'Consumption'",
  "serviceName eq 'Azure Database for MySQL' and priceType eq 'Consumption'",
  "serviceName eq 'Event Hubs' and priceType eq 'Consumption'",
  "serviceName eq 'Service Bus' and priceType eq 'Consumption'",
  "serviceName eq 'API Management' and priceType eq 'Consumption'",
  "serviceName eq 'Application Gateway' and priceType eq 'Consumption'",
  "serviceName eq 'Azure Bastion' and priceType eq 'Consumption'",
  "serviceName eq 'Azure Monitor' and priceType eq 'Consumption'",
  "serviceName eq 'Azure Front Door Service' and priceType eq 'Consumption'",
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
    await new Promise((r) => setTimeout(r, 1200));
  }
  return null;
}

async function main() {
  console.log('Fetching authentic Azure retail prices from Microsoft...');
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  const allItems = [];
  const seenKeys = new Set();

  for (let i = 0; i < QUERIES.length; i++) {
    const query = QUERIES[i];
    const encoded = encodeURIComponent(query);
    const url = `https://prices.azure.com/api/retail/prices?$filter=${encoded}`;
    console.log(`[${i + 1}/${QUERIES.length}] Querying: ${query.slice(0, 60)}...`);

    const data = await fetchWithRetry(url);
    if (data && Array.isArray(data.Items)) {
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
      console.log(`   -> Fetched ${data.Items.length} items (${added} new, total: ${allItems.length})`);
    } else {
      console.warn(`   -> No items returned for query`);
    }

    // Be gentle with rate limits
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\nCollection complete! Total unique items collected: ${allItems.length}`);

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
