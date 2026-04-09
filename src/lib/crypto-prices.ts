import { useState, useEffect, useCallback } from "react";
import { SupportedCurrency, MIN_SOL, MAX_SOL } from "./presale-data";

const COINGECKO_IDS: Record<SupportedCurrency, string> = {
  SOL: "solana",
  ETH: "ethereum",
  BNB: "binancecoin",
  USDT: "tether",
  TRX: "tron",
  BTC: "bitcoin",
};

export type CryptoPrices = Record<SupportedCurrency, number>;

const FALLBACK_PRICES: CryptoPrices = {
  SOL: 83.1,
  ETH: 2186,
  BNB: 600,
  USDT: 1,
  TRX: 0.3,
  BTC: 71000,
};

export function useCryptoPrices(): { prices: CryptoPrices; loading: boolean; lastUpdated: Date | null } {
  const [prices, setPrices] = useState<CryptoPrices>(FALLBACK_PRICES);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      const ids = Object.values(COINGECKO_IDS).join(",");
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
      if (!res.ok) throw new Error("CoinGecko API error");
      const data = await res.json();

      const newPrices: CryptoPrices = { ...FALLBACK_PRICES };
      for (const [symbol, id] of Object.entries(COINGECKO_IDS)) {
        if (data[id]?.usd) {
          newPrices[symbol as SupportedCurrency] = data[id].usd;
        }
      }
      setPrices(newPrices);
      setLastUpdated(new Date());
    } catch {
      setPrices(FALLBACK_PRICES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60_000); // refresh every 60s
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return { prices, loading, lastUpdated };
}

/** Convert a crypto amount to its SOL equivalent */
export function convertToSol(amount: number, currency: SupportedCurrency, prices: CryptoPrices): number {
  if (currency === "SOL") return amount;
  const usdValue = amount * prices[currency];
  return usdValue / prices.SOL;
}

/** Get min/max amounts for a given currency based on SOL min/max */
export function getCurrencyLimits(currency: SupportedCurrency, prices: CryptoPrices): { min: number; max: number } {
  if (currency === "SOL") return { min: MIN_SOL, max: MAX_SOL };
  const minUsd = MIN_SOL * prices.SOL;
  const maxUsd = MAX_SOL * prices.SOL;
  return {
    min: parseFloat((minUsd / prices[currency]).toFixed(6)),
    max: parseFloat((maxUsd / prices[currency]).toFixed(6)),
  };
}
