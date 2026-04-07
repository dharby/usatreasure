import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, Coins, Gift, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/presale-data";
import { getInvestorsByWallet, InvestorPurchase } from "@/lib/investor-store";
import { toast } from "sonner";

interface DashboardProps {
  walletConnected: boolean;
  walletAddress: string;
  onConnect: () => void;
}

export default function DashboardSection({ walletConnected, walletAddress, onConnect }: DashboardProps) {
  const [purchases, setPurchases] = useState<InvestorPurchase[]>([]);
  const handleClaim = () => toast.info("Claim will be available after presale ends.");

  useEffect(() => {
    if (!walletAddress) { setPurchases([]); return; }
    const load = () => setPurchases(getInvestorsByWallet(walletAddress));
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [walletAddress]);

  const totalContributed = purchases.reduce((a, p) => a + p.solEquivalent, 0);
  const totalTokens = purchases.reduce((a, p) => a + p.tokensTotal, 0);
  const totalBonus = purchases.reduce((a, p) => a + p.tokensBonus, 0);

  return (
    <section id="dashboard" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
            <span className="gold-gradient-text">Your Dashboard</span>
          </h2>
          <p className="text-muted-foreground">Track your contributions and token allocations</p>
        </motion.div>

        {!walletConnected ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card max-w-md mx-auto p-8 text-center"
          >
            <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-sm text-muted-foreground mb-6">View your contributions and token allocations</p>
            <Button onClick={onConnect} className="gold-gradient-bg text-primary-foreground font-semibold hover:opacity-90">
              Connect Wallet
            </Button>
          </motion.div>
        ) : purchases.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card max-w-md mx-auto p-8 text-center"
          >
            <Coins className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold mb-2">No Purchases Yet</h3>
            <p className="text-sm text-muted-foreground">
              Your purchases will appear here once your deposit to the treasury address is verified.
            </p>
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Wallet, label: "SOL Equivalent", value: `${totalContributed.toFixed(2)} SOL` },
                { icon: Coins, label: "Total Tokens", value: formatNumber(totalTokens) },
                { icon: Gift, label: "Bonus Earned", value: formatNumber(totalBonus) },
                { icon: Clock, label: "Claimable", value: formatNumber(0) },
              ].map(({ icon: Icon, label, value }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-4 text-center"
                >
                  <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">{label}</p>
                  <p className="font-bold text-lg gold-gradient-text">{value}</p>
                </motion.div>
              ))}
            </div>

            <div className="glass-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-display font-semibold mb-1">Claim Your Tokens</h4>
                <p className="text-sm text-muted-foreground">Tokens will be airdropped after presale completion</p>
              </div>
              <Button onClick={handleClaim} variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                Claim USAT
              </Button>
            </div>

            <div className="glass-card p-6">
              <h4 className="font-display font-semibold mb-4">Transaction History</h4>
              <div className="space-y-3">
                {purchases.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{tx.amount} {tx.currency} → {formatNumber(tx.tokensTotal)} USAT</p>
                      <p className="text-xs text-muted-foreground">Stage {tx.stage} • {tx.date}{tx.tokensBonus > 0 ? ` • +${formatNumber(tx.tokensBonus)} bonus` : ""}</p>
                    </div>
                    <button className="text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
