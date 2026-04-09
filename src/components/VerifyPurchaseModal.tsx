import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VerifyPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (walletAddress: string) => void;
}

export default function VerifyPurchaseModal({ isOpen, onClose, onVerify }: VerifyPurchaseModalProps) {
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = walletAddress.trim();
    if (!trimmed) return;
    setLoading(true);
    // Small delay for UX
    await new Promise(r => setTimeout(r, 300));
    onVerify(trimmed);
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card gold-border-glow w-full max-w-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h3 className="font-display text-lg font-bold text-foreground">Verify Purchase</h3>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>




            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter your wallet address..."
                className="bg-muted/50 border-border/50"
              />
              <Button
                type="submit"
                disabled={!walletAddress.trim() || loading}
                className="w-full gold-gradient-bg text-primary-foreground font-semibold"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Look Up Purchases
              </Button>
            </form>

            <p className="text-[10px] text-muted-foreground text-center mt-3">
              Can't connect your wallet? Use this to check your purchase status.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
