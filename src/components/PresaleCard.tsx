import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, Copy, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CountdownTimer from "@/components/CountdownTimer";
import { formatNumber, formatUSD } from "@/lib/presale-data";
import { usePresaleConfig } from "@/lib/presale-config-context";
import { toast } from "sonner";

interface PresaleCardProps {
  walletConnected: boolean;
  onConnect: () => void;
}

export default function PresaleCard({ walletConnected, onConnect }: PresaleCardProps) {
  const [solAmount, setSolAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const { currentStage: stage, totalRaised, totalSold, progress, stageEndDate, config, calculateTokens, presaleAllocation } = usePresaleConfig();
  const tokens = calculateTokens(parseFloat(solAmount) || 0);

  const handleCopy = () => {
    navigator.clipboard.writeText(config.treasuryAddress);
    setCopied(true);
    toast.success("Treasury address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContribute = () => {
    if (!walletConnected) { onConnect(); return; }
    if (!solAmount || parseFloat(solAmount) <= 0) { toast.error("Enter a valid SOL amount"); return; }
    toast.success(`Transaction submitted for ${solAmount} SOL!`);
    setSolAmount("");
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
                <span className="text-sm text-primary font-medium">{stage.bonus}% Bonus Tokens — Stage {stage.id} Exclusive</span>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">You Send (SOL)</label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={solAmount}
                    onChange={e => setSolAmount(e.target.value)}
                    className="bg-muted/50 border-border/50 text-lg h-12 pr-16"
                    min="0"
                    step="0.1"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    ≈ {formatUSD((parseFloat(solAmount) || 0) * config.solPriceUsd)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[0.5, 1, 5, 10].map(v => (
                  <button
                    key={v}
                    onClick={() => setSolAmount(v.toString())}
                    className="py-1.5 rounded-lg bg-muted/50 border border-border/50 text-xs text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                  >
                    {v} SOL
                  </button>
                ))}
              </div>

              {parseFloat(solAmount) > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-muted/30 rounded-xl p-4 space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Tokens</span>
                    <span className="text-foreground">{formatNumber(tokens.base)} USAT</span>
                  </div>
                  {tokens.bonus > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-primary">+ Bonus ({stage.bonus}%)</span>
                      <span className="text-primary">{formatNumber(tokens.bonus)} USAT</span>
                    </div>
                  )}
                  <div className="border-t border-border/30 pt-2 flex justify-between text-sm font-bold">
                    <span className="text-foreground">Total Tokens</span>
                    <span className="gold-gradient-text">{formatNumber(tokens.total)} USAT</span>
                  </div>
                </motion.div>
              )}
            </div>

            <Button
              onClick={handleContribute}
              className="w-full h-12 gold-gradient-bg text-primary-foreground font-bold text-base hover:opacity-90 transition-opacity"
              size="lg"
            >
              {walletConnected ? "Contribute SOL" : "Connect Wallet to Contribute"}
            </Button>

            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Treasury Address</p>
              <div className="flex items-center gap-2">
                <code className="text-xs text-foreground/70 flex-1 truncate">{config.treasuryAddress}</code>
                <button onClick={handleCopy} className="text-muted-foreground hover:text-primary transition-colors">
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
