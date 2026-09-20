export interface AzureServiceOption {
  name: string;
  category: string;
}

export interface AzureRegionOption {
  armRegionName: string;
  displayName: string;
  geography: string;
}

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

export const AZURE_SERVICES: AzureServiceOption[] = [
  { name: 'Virtual Machines', category: 'Compute' },
  { name: 'Storage', category: 'Storage' },
  { name: 'Azure App Service', category: 'Compute' },
  { name: 'Azure SQL Database', category: 'Databases' },
  { name: 'Virtual Network', category: 'Networking' },
  { name: 'Azure Firewall', category: 'Security' },
  { name: 'Application Gateway', category: 'Networking' },
  { name: 'Azure Kubernetes Service', category: 'Containers' },
  { name: 'Container Instances', category: 'Containers' },
  { name: 'Azure Cosmos DB', category: 'Databases' },
  { name: 'Bandwidth', category: 'Networking' },
  { name: 'Key Vault', category: 'Security' },
  { name: 'Azure Bastion', category: 'Security' },
  { name: 'Log Analytics', category: 'Management' },
  { name: 'Azure Monitor', category: 'Management' },
  { name: 'Azure DevOps', category: 'DevOps' },
  { name: 'Container Registry', category: 'Containers' },
  { name: 'Azure Database for PostgreSQL', category: 'Databases' },
  { name: 'Azure Database for MySQL', category: 'Databases' },
  { name: 'Event Hubs', category: 'Integration' },
  { name: 'Service Bus', category: 'Integration' },
  { name: 'API Management', category: 'Integration' },
  { name: 'Azure Functions', category: 'Compute' },
  { name: 'Cognitive Services', category: 'AI + Machine Learning' },
  { name: 'Azure Front Door Service', category: 'Networking' },
];

export const AZURE_REGIONS: AzureRegionOption[] = [
  { armRegionName: 'centralindia', displayName: 'Central India (Pune)', geography: 'India' },
  { armRegionName: 'southindia', displayName: 'South India (Chennai)', geography: 'India' },
  { armRegionName: 'westindia', displayName: 'West India (Mumbai)', geography: 'India' },
  { armRegionName: 'eastus', displayName: 'East US (Virginia)', geography: 'US' },
  { armRegionName: 'eastus2', displayName: 'East US 2 (Virginia)', geography: 'US' },
  { armRegionName: 'westus', displayName: 'West US (California)', geography: 'US' },
  { armRegionName: 'westus2', displayName: 'West US 2 (Washington)', geography: 'US' },
  { armRegionName: 'westus3', displayName: 'West US 3 (Phoenix)', geography: 'US' },
  { armRegionName: 'centralus', displayName: 'Central US (Iowa)', geography: 'US' },
  { armRegionName: 'northcentralus', displayName: 'North Central US (Illinois)', geography: 'US' },
  { armRegionName: 'southcentralus', displayName: 'South Central US (Texas)', geography: 'US' },
  { armRegionName: 'westeurope', displayName: 'West Europe (Netherlands)', geography: 'Europe' },
  { armRegionName: 'northeurope', displayName: 'North Europe (Ireland)', geography: 'Europe' },
  { armRegionName: 'uksouth', displayName: 'UK South (London)', geography: 'Europe' },
  { armRegionName: 'ukwest', displayName: 'UK West (Cardiff)', geography: 'Europe' },
  { armRegionName: 'francecentral', displayName: 'France Central (Paris)', geography: 'Europe' },
  { armRegionName: 'germanywestcentral', displayName: 'Germany West Central (Frankfurt)', geography: 'Europe' },
  { armRegionName: 'southeastasia', displayName: 'Southeast Asia (Singapore)', geography: 'Asia Pacific' },
  { armRegionName: 'eastasia', displayName: 'East Asia (Hong Kong)', geography: 'Asia Pacific' },
  { armRegionName: 'australiaeast', displayName: 'Australia East (Sydney)', geography: 'Asia Pacific' },
  { armRegionName: 'australiasoutheast', displayName: 'Australia Southeast (Melbourne)', geography: 'Asia Pacific' },
  { armRegionName: 'japaneast', displayName: 'Japan East (Tokyo)', geography: 'Asia Pacific' },
  { armRegionName: 'japanwest', displayName: 'Japan West (Osaka)', geography: 'Asia Pacific' },
  { armRegionName: 'canadacentral', displayName: 'Canada Central (Toronto)', geography: 'Canada' },
  { armRegionName: 'canadaeast', displayName: 'Canada East (Quebec)', geography: 'Canada' },
  { armRegionName: 'brazilsouth', displayName: 'Brazil South (Sao Paulo)', geography: 'South America' },
  { armRegionName: 'uaenorth', displayName: 'UAE North (Dubai)', geography: 'Middle East' },
  { armRegionName: 'southafricanorth', displayName: 'South Africa North (Johannesburg)', geography: 'Africa' },
];

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CAD)' },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar (AUD)' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (JPY)' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real (BRL)' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc (CHF)' },
  { code: 'SGD', symbol: 'SG$', name: 'Singapore Dollar (SGD)' },
];

export const POPULAR_SKU_SUGGESTIONS = [
  'D4s v5',
  'D2s v5',
  'B2s',
  'B4ms',
  'E4s v5',
  'Standard_D4s_v5',
  'Standard_B2s',
  'General Purpose',
  'Hot LRS',
  'Cool LRS',
];
