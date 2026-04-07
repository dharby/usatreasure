import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PresaleStage, PRESALE_STAGES, SOL_PRICE_USD, TREASURY_ADDRESS, TREASURY_ADDRESSES, TOKENOMICS, TOTAL_SUPPLY, PRESALE_ALLOCATION, MIN_SOL, MAX_SOL, SupportedCurrency } from "./presale-data";

const STORAGE_KEY = "usat_admin_config";

export interface PresaleConfig {
  solPriceUsd: number;
  treasuryAddress: string;
  stageEndDate: string;
  stages: PresaleStage[];
}

const DEFAULT_CONFIG: PresaleConfig = {
  solPriceUsd: SOL_PRICE_USD,
  treasuryAddress: TREASURY_ADDRESS,
  stageEndDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16),
  stages: PRESALE_STAGES,
};

interface PresaleContextValue {
  config: PresaleConfig;
  currentStage: PresaleStage;
  totalRaised: number;
  totalSold: number;
  progress: number;
  stageEndDate: Date;
  tokenomics: typeof TOKENOMICS;
  totalSupply: number;
  presaleAllocation: number;
  treasuryAddresses: Record<string, string>;
  minSol: number;
  maxSol: number;
  calculateTokens: (solAmount: number) => { base: number; bonus: number; total: number };
}

function loadConfig(): PresaleConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_CONFIG;
}

function deriveContext(config: PresaleConfig): PresaleContextValue {
  const currentStage = config.stages.find(s => s.sold < s.allocation) || config.stages[config.stages.length - 1];
  const totalRaised = config.stages.reduce((acc, s) => acc + s.sold * s.price, 0);
  const totalSold = config.stages.reduce((acc, s) => acc + s.sold, 0);
  const progress = (totalSold / PRESALE_ALLOCATION) * 100;

  return {
    config,
    currentStage,
    totalRaised,
    totalSold,
    progress,
    stageEndDate: new Date(config.stageEndDate),
    tokenomics: TOKENOMICS,
    totalSupply: TOTAL_SUPPLY,
    presaleAllocation: PRESALE_ALLOCATION,
    treasuryAddresses: TREASURY_ADDRESSES,
    minSol: MIN_SOL,
    maxSol: MAX_SOL,
    calculateTokens: (solAmount: number) => {
      const usdValue = solAmount * config.solPriceUsd;
      const base = usdValue / currentStage.price;
      const bonusEligible = solAmount >= MIN_SOL;
      const bonus = bonusEligible ? base * (currentStage.bonus / 100) : 0;
      return { base: Math.floor(base), bonus: Math.floor(bonus), total: Math.floor(base + bonus) };
    },
  };
}

const PresaleContext = createContext<PresaleContextValue | null>(null);

export function PresaleConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<PresaleConfig>(loadConfig);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setConfig(loadConfig());
    };
    const interval = setInterval(() => {
      const current = loadConfig();
      setConfig(prev => {
        const prevStr = JSON.stringify(prev);
        const newStr = JSON.stringify(current);
        return prevStr !== newStr ? current : prev;
      });
    }, 2000);
    window.addEventListener("storage", handleStorage);
    return () => { window.removeEventListener("storage", handleStorage); clearInterval(interval); };
  }, []);

  return <PresaleContext.Provider value={deriveContext(config)}>{children}</PresaleContext.Provider>;
}

export function usePresaleConfig(): PresaleContextValue {
  const ctx = useContext(PresaleContext);
  if (!ctx) throw new Error("usePresaleConfig must be used within PresaleConfigProvider");
  return ctx;
}
