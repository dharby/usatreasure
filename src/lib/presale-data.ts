export interface PresaleStage {
  id: number;
  name: string;
  price: number; // USD per token
  allocation: number; // tokens
  sold: number; // tokens sold
  bonus: number; // percentage
}

export const PRESALE_STAGES: PresaleStage[] = [
  { id: 1, name: "Eagle", price: 0.0002, allocation: 50_000_000, sold: 50_000_000, bonus: 0 },
  { id: 2, name: "Liberty", price: 0.00029, allocation: 50_000_000, sold: 50_000_000, bonus: 45 },
  { id: 3, name: "Freedom", price: 0.00042, allocation: 50_000_000, sold: 38_750_000, bonus: 45 },
  { id: 4, name: "Patriot", price: 0.00062, allocation: 50_000_000, sold: 0, bonus: 48 },
  { id: 5, name: "Sentinel", price: 0.0009, allocation: 50_000_000, sold: 0, bonus: 45 },
  { id: 6, name: "Guardian", price: 0.00131, allocation: 40_000_000, sold: 0, bonus: 46 },
  { id: 7, name: "Sovereign", price: 0.00191, allocation: 40_000_000, sold: 0, bonus: 46 },
  { id: 8, name: "Dominion", price: 0.00279, allocation: 30_000_000, sold: 0, bonus: 46 },
  { id: 9, name: "Empire", price: 0.00407, allocation: 20_000_000, sold: 0, bonus: 46 },
  { id: 10, name: "Apex", price: 0.006, allocation: 20_000_000, sold: 0, bonus: 0 },
];

export const TREASURY_ADDRESSES: Record<string, string> = {
  SOL: "CGA587QFDvWwJeVhgQ8X3RfG3gKcm5SSv7ERzwxujBVv",
  BTC: "bc1qdh3tehf2uanff4anvegpusj5f7huf84wm0sr0j",
  TRX: "TLk7Z7qvAvhzaJzWpUqiQLe4ytQit1hA1m",
  ETH: "0xe8E288AB0609a318e06d9277e36283954595E5c2",
  BNB: "0xe8E288AB0609a318e06d9277e36283954595E5c2",
  USDT: "0xe8E288AB0609a318e06d9277e36283954595E5c2",
};

export const TREASURY_ADDRESS = TREASURY_ADDRESSES.SOL;

export const SUPPORTED_CURRENCIES = ["SOL", "ETH", "BNB", "USDT", "TRX", "BTC"] as const;
export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];

export const MIN_SOL = 5;
export const MAX_SOL = 100;

export const SOL_PRICE_USD = 83.74;
export const TOTAL_SUPPLY = 1_000_000_000;
export const PRESALE_ALLOCATION = 50_000_000;

export const TOKENOMICS = [
  { label: "Presale", percentage: 40, color: "hsl(42 60% 58%)" },
  { label: "Liquidity Pool", percentage: 25, color: "hsl(220 60% 50%)" },
  { label: "Team & Advisors", percentage: 10, color: "hsl(160 50% 45%)" },
  { label: "Marketing", percentage: 10, color: "hsl(0 60% 55%)" },
  { label: "Ecosystem", percentage: 10, color: "hsl(280 50% 55%)" },
  { label: "Reserve", percentage: 5, color: "hsl(42 30% 40%)" },
];

export function getCurrentStage(): PresaleStage {
  return PRESALE_STAGES.find(s => s.sold < s.allocation) || PRESALE_STAGES[PRESALE_STAGES.length - 1];
}

export function getTotalRaised(): number {
  return PRESALE_STAGES.reduce((acc, s) => acc + s.sold * s.price, 0);
}

export function getTotalSold(): number {
  return PRESALE_STAGES.reduce((acc, s) => acc + s.sold, 0);
}

export function calculateTokens(solAmount: number, stage: PresaleStage): { base: number; bonus: number; total: number } {
  const usdValue = solAmount * SOL_PRICE_USD;
  const base = usdValue / stage.price;
  const bonusEligible = solAmount >= MIN_SOL;
  const bonus = bonusEligible ? base * (stage.bonus / 100) : 0;
  return { base: Math.floor(base), bonus: Math.floor(bonus), total: Math.floor(base + bonus) };
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

export function formatUSD(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: n < 0.01 ? 4 : 2 }).format(n);
}
