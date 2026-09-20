# Azure Cost Finder (AZ Cost Calculator)

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4+-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Azure API](https://img.shields.io/badge/API-Azure_Retail_Prices-0078D4?logo=microsoft-azure&logoColor=white)](https://prices.azure.com/api/retail/prices)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A production-grade, 100% client-side web application designed for Cloud Engineers, DevOps architects, and FinOps practitioners to query real-time Microsoft Azure retail pricing directly from Microsoft's public [Azure Retail Prices API](https://prices.azure.com/api/retail/prices).

---

## Zero Cost & Zero Credentials

This application requires:
* **NO** Azure subscription
* **NO** Azure credentials or service principals
* **NO** API keys or secrets
* **NO** Backend server or reverse proxy
* **NO** Database
* **NO** Paid cloud hosting services

All queries are executed client-side directly against Microsoft's public, unauthenticated, and CORS-enabled Azure Retail Prices endpoint.

---

## Key Features

* **Real-Time Dynamic Pricing**: Retrieves current Azure retail rates without any hardcoded pricing datasets.
* **Granular Search Filters**:
  * **Azure Services**: Virtual Machines, Storage, Azure SQL Database, Azure Kubernetes Service (AKS), Container Instances, Azure Firewall, Application Gateway, and more.
  * **Regions**: Filter by geographical Azure region codes (e.g. `centralindia`, `eastus`, `westeurope`, `southeastasia`, or worldwide).
  * **Product / SKU Keyword Search**: Instant query support for `D4s v5`, `Standard_B2s`, `Hot LRS`, etc.
  * **Operating System**: Filter between Windows and Linux machine series.
  * **Currency Switcher**: Real-time pricing in `USD`, `INR`, `EUR`, `GBP`, `CAD`, `AUD`, and more.
* **Interactive Cost Projections**:
  * **Hourly Rates**: Real-time baseline unit cost.
  * **Monthly Calculations**: Configurable hours per month (defaults to standard `730` hours/month).
  * **Annual Projections**: 12-month runtime estimate (8,760 hours/year).
  * **Multi-Instance Scaling**: Multiply runtime estimates by custom resource quantities.
* **Robust API Handling**:
  * Full pagination via Microsoft's `NextPageLink`.
  * Safe OData `$filter` URL escaping and query construction.
  * Client-side timeout management (15s abort controller).
  * Informative empty-state recommendations and network error recovery.
* **Cloud Engineer Interface**:
  * Dark ink glassmorphism design with Azure blue and gold accents.
  * High-density, scannable rate cards with meter IDs, ARM SKU names, and effective dates.
  * 100% responsive across desktop, tablet, and mobile browsers.

---

## Architecture & Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18.3 (TypeScript, JSX) |
| **Build Tool** | Vite 5.4 |
| **Styling** | Tailwind CSS 3.4 + PostCSS |
| **Icons** | Lucide React |
| **Networking** | Native Fetch API + AbortController |
| **Deployment** | GitHub Actions + GitHub Pages (`actions/deploy-pages@v4`) |

---

## Azure Retail Prices API Overview

Microsoft provides public access to Azure retail pricing via an unauthenticated OData-compliant REST endpoint:

```http
GET https://prices.azure.com/api/retail/prices
```

### Supported Query Parameters

| Parameter | Type | Description | Example |
|---|---|---|---|
| `currencyCode` | String | ISO 4217 currency code enclosed in single quotes | `currencyCode='INR'` |
| `$filter` | OData | OData boolean expression for filtering records | `serviceName eq 'Virtual Machines' and armRegionName eq 'centralindia'` |
| `$skip` | Integer | Pagination offset | `$skip=1000` |
| `$top` | Integer | Maximum items per page (default 100) | `$top=100` |

### Example Query

Querying Linux `D4s v5` Virtual Machines in `Central India` in `INR`:

```http
GET https://prices.azure.com/api/retail/prices?currencyCode='INR'&$filter=serviceName eq 'Virtual Machines' and armRegionName eq 'centralindia' and contains(meterName, 'D4s v5') and priceType eq 'Consumption' and not contains(productName, 'Windows')
```

---

## Pricing Calculation Methodology

1. **Hourly Cost**:
   $$\text{Hourly Cost} = \text{Retail Unit Price} \times \text{Quantity}$$

2. **Monthly Cost**:
   * For hourly resources:
     $$\text{Monthly Cost} = \text{Retail Unit Price} \times \text{Hours/Month (730)} \times \text{Quantity}$$
   * For non-hourly resources (e.g. GB/month):
     $$\text{Monthly Cost} = \text{Retail Unit Price} \times \text{Quantity}$$

3. **Annual Cost**:
   $$\text{Annual Cost} = \text{Monthly Cost} \times 12$$

---

## Local Development

### Prerequisites
* Node.js 18.x or 20.x
* npm (bundled with Node.js)

### Installation & Execution

```bash
# 1. Navigate to the project directory
cd "d:/MY_Portfolio/AZ Cost Calculator"

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

The application will be available at `http://localhost:5173`.

### Production Build

```bash
# Compile TypeScript and generate minified bundle in dist/
npm run build

# Preview production build locally
npm run preview
```

---

## GitHub Pages Deployment

The repository includes an automated GitHub Actions deployment workflow at `.github/workflows/deploy.yml`.

### Deployment Steps:
1. Create a public repository on GitHub (e.g., `AZ-Cost-Calculator`).
2. Link your local repository to GitHub:
   ```bash
   git remote add origin https://github.com/USERNAME/AZ-Cost-Calculator.git
   git branch -M main
   git push -u origin main
   ```
3. In your GitHub repository settings:
   * Go to **Settings** > **Pages**.
   * Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. The workflow will automatically build and publish your application to:
   ```text
   https://USERNAME.github.io/AZ-Cost-Calculator/
   ```

Because `vite.config.ts` uses `base: './'`, all bundled assets load with relative paths, preventing 404 routing errors on GitHub Pages subpaths.

---

## Limitations of Azure Public Retail Pricing

> [!NOTE]
> **Important Billing Consideration:**
> Prices shown in this tool reflect Microsoft's published Azure retail prices. Actual cloud expenditure may differ based on:
> * Enterprise Agreements (EA) or Microsoft Customer Agreement (MCA) discounts.
> * Reserved Instances (1-year or 3-year commitments).
> * Azure Savings Plans for Compute.
> * Microsoft Azure Consumption Commitment (MACC).
> * Regional taxes, value-added taxes (VAT), or exchange rate fluctuations.
> * Promotional credits or Azure sponsorship subscriptions.

---

## Author
**Aakash Trivedi**
* Cloud & DevOps Engineer
* Microsoft Certified: Azure Administrator Associate (AZ-104)
