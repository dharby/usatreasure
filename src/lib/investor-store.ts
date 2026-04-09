import { supabase } from "@/integrations/supabase/client";
import { SupportedCurrency } from "./presale-data";

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
  verified?: boolean;
}

// Map DB row to our interface
function mapRow(row: any): InvestorPurchase {
  return {
    id: row.id,
    walletAddress: row.wallet_address,
    currency: row.currency as SupportedCurrency,
    amount: Number(row.amount),
    solEquivalent: Number(row.sol_equivalent),
    tokensBase: Number(row.tokens_base),
    tokensBonus: Number(row.tokens_bonus),
    tokensTotal: Number(row.tokens_total),
    stage: row.stage,
    date: row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : "",
    note: row.note || undefined,
    verified: row.verified,
  };
}

export async function getInvestorsFromDb(): Promise<InvestorPurchase[]> {
  const { data, error } = await supabase
    .from("investor_purchases")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching investors:", error);
    return [];
  }
  return (data || []).map(mapRow);
}

export async function getInvestorsByWalletFromDb(walletAddress: string): Promise<InvestorPurchase[]> {
  const { data, error } = await supabase
    .from("investor_purchases")
    .select("*")
    .ilike("wallet_address", walletAddress)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching wallet purchases:", error);
    return [];
  }
  return (data || []).map(mapRow);
}

export async function addInvestorToDb(purchase: Omit<InvestorPurchase, "id">): Promise<InvestorPurchase | null> {
  const { data, error } = await supabase
    .from("investor_purchases")
    .insert({
      wallet_address: purchase.walletAddress,
      currency: purchase.currency,
      amount: purchase.amount,
      sol_equivalent: purchase.solEquivalent,
      tokens_base: purchase.tokensBase,
      tokens_bonus: purchase.tokensBonus,
      tokens_total: purchase.tokensTotal,
      stage: purchase.stage,
      note: purchase.note || null,
      verified: true,
    })
    .select()
    .single();
  if (error) {
    console.error("Error adding investor:", error);
    return null;
  }
  return data ? mapRow(data) : null;
}

export async function removeInvestorFromDb(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("investor_purchases")
    .delete()
    .eq("id", id);
  if (error) {
    console.error("Error removing investor:", error);
    return false;
  }
  return true;
}

// Legacy localStorage helpers kept for backward compat during migration
const INVESTORS_KEY = "usat_investors";

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

export function getInvestorsByWallet(walletAddress: string): InvestorPurchase[] {
  return getInvestors().filter(i => i.walletAddress.toLowerCase() === walletAddress.toLowerCase());
}
