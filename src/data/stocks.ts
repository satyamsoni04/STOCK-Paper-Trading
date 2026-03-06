export interface StockInfo {
  symbol: string;
  name: string;
  market: 'US' | 'IN';
  price: number;
  change: number;
  changePercent: number;
  sector: string;
}

export const US_STOCKS: StockInfo[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', market: 'US', price: 189.84, change: 2.15, changePercent: 1.14, sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', market: 'US', price: 378.91, change: -1.23, changePercent: -0.32, sector: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla Inc.', market: 'US', price: 248.42, change: 5.67, changePercent: 2.33, sector: 'Automotive' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', market: 'US', price: 178.25, change: 1.89, changePercent: 1.07, sector: 'E-Commerce' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', market: 'US', price: 141.80, change: -0.95, changePercent: -0.67, sector: 'Technology' },
  { symbol: 'META', name: 'Meta Platforms Inc.', market: 'US', price: 505.75, change: 8.32, changePercent: 1.67, sector: 'Technology' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', market: 'US', price: 875.28, change: 12.45, changePercent: 1.44, sector: 'Technology' },
  { symbol: 'NFLX', name: 'Netflix Inc.', market: 'US', price: 628.35, change: -3.21, changePercent: -0.51, sector: 'Entertainment' },
  { symbol: 'AMD', name: 'AMD Inc.', market: 'US', price: 162.47, change: 3.89, changePercent: 2.45, sector: 'Technology' },
  { symbol: 'INTC', name: 'Intel Corp.', market: 'US', price: 31.25, change: -0.45, changePercent: -1.42, sector: 'Technology' },
  { symbol: 'DIS', name: 'Walt Disney Co.', market: 'US', price: 112.50, change: 1.20, changePercent: 1.08, sector: 'Entertainment' },
  { symbol: 'UBER', name: 'Uber Technologies', market: 'US', price: 72.85, change: 0.95, changePercent: 1.32, sector: 'Technology' },
  { symbol: 'ADBE', name: 'Adobe Inc.', market: 'US', price: 548.90, change: -4.50, changePercent: -0.81, sector: 'Technology' },
  { symbol: 'CRM', name: 'Salesforce Inc.', market: 'US', price: 272.15, change: 2.80, changePercent: 1.04, sector: 'Technology' },
  { symbol: 'V', name: 'Visa Inc.', market: 'US', price: 278.60, change: 1.15, changePercent: 0.41, sector: 'Financial' },
  { symbol: 'MA', name: 'Mastercard Inc.', market: 'US', price: 458.30, change: 3.25, changePercent: 0.71, sector: 'Financial' },
  { symbol: 'WMT', name: 'Walmart Inc.', market: 'US', price: 165.80, change: -0.75, changePercent: -0.45, sector: 'Retail' },
  { symbol: 'PEP', name: 'PepsiCo Inc.', market: 'US', price: 172.40, change: 0.60, changePercent: 0.35, sector: 'Consumer' },
  { symbol: 'KO', name: 'Coca-Cola Co.', market: 'US', price: 60.25, change: 0.30, changePercent: 0.50, sector: 'Consumer' },
  { symbol: 'BA', name: 'Boeing Co.', market: 'US', price: 195.60, change: -2.10, changePercent: -1.06, sector: 'Aerospace' },
];

export const IN_STOCKS: StockInfo[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', market: 'IN', price: 2485.50, change: 15.30, changePercent: 0.62, sector: 'Conglomerate' },
  { symbol: 'TCS', name: 'Tata Consultancy', market: 'IN', price: 3892.75, change: -22.40, changePercent: -0.57, sector: 'IT' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', market: 'IN', price: 1635.20, change: 8.90, changePercent: 0.55, sector: 'Banking' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', market: 'IN', price: 1072.45, change: 5.60, changePercent: 0.52, sector: 'Banking' },
  { symbol: 'INFY', name: 'Infosys Ltd.', market: 'IN', price: 1548.30, change: -12.15, changePercent: -0.78, sector: 'IT' },
  { symbol: 'WIPRO', name: 'Wipro Ltd.', market: 'IN', price: 478.90, change: 3.45, changePercent: 0.73, sector: 'IT' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', market: 'IN', price: 2542.60, change: -8.30, changePercent: -0.33, sector: 'FMCG' },
  { symbol: 'SBIN', name: 'State Bank of India', market: 'IN', price: 628.75, change: 4.20, changePercent: 0.67, sector: 'Banking' },
  { symbol: 'ITC', name: 'ITC Ltd.', market: 'IN', price: 438.50, change: 2.15, changePercent: 0.49, sector: 'FMCG' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', market: 'IN', price: 1785.30, change: -6.75, changePercent: -0.38, sector: 'Banking' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', market: 'IN', price: 6892.40, change: 45.20, changePercent: 0.66, sector: 'Financial' },
  { symbol: 'ADANIPORTS', name: 'Adani Ports', market: 'IN', price: 1245.80, change: 18.90, changePercent: 1.54, sector: 'Infrastructure' },
  { symbol: 'LT', name: 'Larsen & Toubro', market: 'IN', price: 3425.60, change: -15.40, changePercent: -0.45, sector: 'Infrastructure' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints', market: 'IN', price: 2856.90, change: 12.30, changePercent: 0.43, sector: 'Consumer' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki', market: 'IN', price: 10542.25, change: -85.60, changePercent: -0.81, sector: 'Automotive' },
  { symbol: 'TITAN', name: 'Titan Company', market: 'IN', price: 3245.70, change: 22.80, changePercent: 0.71, sector: 'Consumer' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical', market: 'IN', price: 1185.40, change: 7.60, changePercent: 0.65, sector: 'Pharma' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', market: 'IN', price: 1142.30, change: -4.80, changePercent: -0.42, sector: 'Telecom' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', market: 'IN', price: 685.90, change: 8.45, changePercent: 1.25, sector: 'Automotive' },
  { symbol: 'POWERGRID', name: 'Power Grid Corp', market: 'IN', price: 278.60, change: 1.95, changePercent: 0.71, sector: 'Utilities' },
];

export const ALL_STOCKS = [...US_STOCKS, ...IN_STOCKS];

export function getStock(symbol: string): StockInfo | undefined {
  return ALL_STOCKS.find(s => s.symbol === symbol);
}

// Simulate price fluctuation
export function getSimulatedPrice(basePrice: number): number {
  const fluctuation = (Math.random() - 0.5) * 2 * basePrice * 0.02;
  return Math.round((basePrice + fluctuation) * 100) / 100;
}
