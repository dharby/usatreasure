import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Zap, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CountdownTimer from "@/components/CountdownTimer";
import { formatNumber, formatUSD, SUPPORTED_CURRENCIES, SupportedCurrency, TREASURY_ADDRESSES, MIN_SOL, MAX_SOL } from "@/lib/presale-data";
import { usePresaleConfig } from "@/lib/presale-config-context";
import { useCryptoPrices, convertToSol, getCurrencyLimits } from "@/lib/crypto-prices";
import { toast } from "sonner";

interface PresaleCardProps {
  walletConnected: boolean;
  onConnect: () => void;
}

const CURRENCY_ICONS: Record<SupportedCurrency, string> = {
  SOL: "◎",
  ETH: "Ξ",
  BNB: "⬡",
  USDT: "₮",
  TRX: "◈",
  BTC: "₿",
};

export default function PresaleCard({ walletConnected, onConnect }: PresaleCardProps) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<SupportedCurrency>("SOL");
  const [copied, setCopied] = useState(false);
  const { currentStage: stage, totalRaised, totalSold, progress, stageEndDate, presaleAllocation, calculateTokens } = usePresaleConfig();
  const { prices, loading: pricesLoading, lastUpdated } = useCryptoPrices();

  const numericAmount = parseFloat(amount) || 0;
  const solEquivalent = convertToSol(numericAmount, currency, prices);
  const tokens = calculateTokens(solEquivalent);
  const limits = getCurrencyLimits(currency, prices);
  const treasuryAddr = TREASURY_ADDRESSES[currency] || TREASURY_ADDRESSES.SOL;

  const isValidAmount = numericAmount >= limits.min && numericAmount <= limits.max;
  const bonusEligible = solEquivalent >= MIN_SOL;

  const handleCopy = () => {
    navigator.clipboard.writeText(treasuryAddr);
    setCopied(true);
    toast.success(`${currency} treasury address copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContribute = () => {
    if (!walletConnected) { onConnect(); return; }
    if (!amount || numericAmount <= 0) { toast.error("Enter a valid amount"); return; }
    if (numericAmount < limits.min) { toast.error(`Minimum purchase is ${limits.min} ${currency}`); return; }
    if (numericAmount > limits.max) { toast.error(`Maximum purchase is ${limits.max} ${currency}`); return; }
    toast.success(`Transaction submitted for ${amount} ${currency}!`);
    setAmount("");
  };

  const quickAmounts: Record<SupportedCurrency, number[]> = {
    SOL: [5, 10, 25, 50],
    ETH: [0.1, 0.5, 1, 5],
    BNB: [1, 3, 5, 20],
    USDT: [500, 1000, 5000, 10000],
    TRX: [5000, 10000, 50000, 100000],
    BTC: [0.01, 0.05, 0.1, 0.5],
  };

  return (
    <section id="presale" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto"
        >
          <div className="glass-card gold-border-glow p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Current Stage</p>
                <h3 className="font-display text-xl font-bold gold-gradient-text">Stage {stage.id}: {stage.name}</h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Token Price</p>
                <p className="text-lg font-bold text-primary">{formatUSD(stage.price)}</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Total Raised: {formatUSD(totalRaised)}</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full gold-gradient-bg rounded-full relative"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 shimmer rounded-full" />
                </motion.div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{formatNumber(totalSold)} sold</span>
                <span>{formatNumber(presaleAllocation)} total</span>
              </div>
            </div>

            <CountdownTimer targetDate={stageEndDate} label="Current Stage Ends In" />

            {stage.bonus > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 mb-6">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">{stage.bonus}% Bonus — Min {MIN_SOL} SOL equivalent</span>
              </div>
            )}

            {/* Currency selector */}
            <div className="mb-4">
              <label className="text-xs text-muted-foreground mb-2 block">Select Currency</label>
              <div className="grid grid-cols-6 gap-1.5">
                {SUPPORTED_CURRENCIES.map(c => (
                  <button
                    key={c}
                    onClick={() => { setCurrency(c); setAmount(""); }}
                    className={`py-2 rounded-lg text-xs font-medium transition-all ${
                      currency === c
                        ? "gold-gradient-bg text-primary-foreground"
                        : "bg-muted/50 border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30"
                    }`}
                  >
                    <span className="block text-base">{CURRENCY_ICONS[c]}</span>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">You Send ({currency})</label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="bg-muted/50 border-border/50 text-lg h-12 pr-24"
                    min="0"
                    step="0.01"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    ≈ {solEquivalent.toFixed(2)} SOL
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>Min: {limits.min} {currency}</span>
                  <span>Max: {limits.max} {currency}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {quickAmounts[currency].map(v => (
                  <button
                    key={v}
                    onClick={() => setAmount(v.toString())}
                    className="py-1.5 rounded-lg bg-muted/50 border border-border/50 text-xs text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                  >
                    {v} {currency}
                  </button>
                ))}
              </div>

              {numericAmount > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-muted/30 rounded-xl p-4 space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">USD Value</span>
                    <span className="text-foreground">{formatUSD(numericAmount * prices[currency])}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">SOL Equivalent</span>
                    <span className="text-foreground">{solEquivalent.toFixed(4)} SOL</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Tokens</span>
                    <span className="text-foreground">{formatNumber(tokens.base)} USAT</span>
                  </div>
                  {tokens.bonus > 0 ? (
                    <div className="flex justify-between text-sm">
                      <span className="text-primary">+ Bonus ({stage.bonus}%)</span>
                      <span className="text-primary">{formatNumber(tokens.bonus)} USAT</span>
                    </div>
                  ) : !bonusEligible && stage.bonus > 0 ? (
                    <div className="text-xs text-muted-foreground italic">
                      Deposit ≥ {MIN_SOL} SOL equivalent for {stage.bonus}% bonus
                    </div>
                  ) : null}
                  <div className="border-t border-border/30 pt-2 flex justify-between text-sm font-bold">
                    <span className="text-foreground">Total Tokens</span>
                    <span className="gold-gradient-text">{formatNumber(tokens.total)} USAT</span>
                  </div>
                  {!isValidAmount && numericAmount > 0 && (
                    <p className="text-xs text-destructive">
                      Amount must be between {limits.min} and {limits.max} {currency}
                    </p>
                  )}
                </motion.div>
              )}
            </div>

            <Button
              onClick={handleContribute}
              className="w-full h-12 gold-gradient-bg text-primary-foreground font-bold text-base hover:opacity-90 transition-opacity"
              size="lg"
            >
              {walletConnected ? `Buy with ${currency}` : "Connect Wallet to Buy"}
            </Button>

            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">{currency} Treasury Address</p>
              <div className="flex items-center gap-2">
                <code className="text-xs text-foreground/70 flex-1 truncate">{treasuryAddr}</code>
                <button onClick={handleCopy} className="text-muted-foreground hover:text-primary transition-colors">
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {lastUpdated && (
              <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
                <RefreshCw className="w-3 h-3" />
                Prices updated {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
