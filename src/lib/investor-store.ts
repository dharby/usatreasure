import { SupportedCurrency } from "./presale-data";

const INVESTORS_KEY = "usat_investors";

export interface InvestorPurchase {
  id: string;
  walletAddress: string;
  currency: SupportedCurrency;
  amount: number;
  solEquivalent: number;
  tokensBase: number;
  tokensBonus: number;
  tokensTotal: number;
  stage: number;
  date: string;
  note?: string;
}

export function getInvestors(): InvestorPurchase[] {
  try {
    const saved = localStorage.getItem(INVESTORS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveInvestors(investors: InvestorPurchase[]) {
  localStorage.setItem(INVESTORS_KEY, JSON.stringify(investors));
}

export function addInvestor(purchase: InvestorPurchase) {
  const investors = getInvestors();
  investors.push(purchase);
  saveInvestors(investors);
}

export function removeInvestor(id: string) {
  const investors = getInvestors().filter(i => i.id !== id);
  saveInvestors(investors);
}

export function getInvestorsByWallet(walletAddress: string): InvestorPurchase[] {
  return getInvestors().filter(i => i.walletAddress.toLowerCase() === walletAddress.toLowerCase());
}
