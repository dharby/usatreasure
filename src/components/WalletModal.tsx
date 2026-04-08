import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, ExternalLink } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";

interface WalletOption {
  name: string;
  icon: string;
  type: "solana" | "evm";
  deepLink?: string;
  detectProvider?: () => boolean;
}

const WALLET_OPTIONS: WalletOption[] = [
  {
    name: "Phantom",
    icon: "👻",
    type: "solana",
    detectProvider: () => !!(window as any).phantom?.solana,
    deepLink: "https://phantom.app/ul/browse/",
  },
  {
    name: "Solflare",
    icon: "☀️",
    type: "solana",
    detectProvider: () => !!(window as any).solflare,
    deepLink: "https://solflare.com/ul/v1/browse/",
  },
  {
    name: "MetaMask",
    icon: "🦊",
    type: "evm",
    detectProvider: () => !!(window as any).ethereum?.isMetaMask,
    deepLink: "https://metamask.app.link/dapp/",
  },
  {
    name: "Trust Wallet",
    icon: "🛡️",
    type: "evm",
    detectProvider: () => !!(window as any).trustwallet || !!(window as any).ethereum?.isTrust,
    deepLink: "https://link.trustwallet.com/open_url?coin_id=60&url=",
  },
  {
    name: "SafePal",
    icon: "🔐",
    type: "evm",
    detectProvider: () => !!(window as any).safepalProvider || !!(window as any).ethereum?.isSafePal,
    deepLink: "https://www.safepal.com/",
  },
];

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEvmConnect: (address: string, walletName: string) => void;
}

export default function WalletModal({ isOpen, onClose, onEvmConnect }: WalletModalProps) {
  const { select, wallets } = useWallet();
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleSolanaWallet = async (walletName: string) => {
    setConnecting(walletName);
    try {
      const adapter = wallets.find(w => w.adapter.name.toLowerCase().includes(walletName.toLowerCase()));
      if (adapter) {
        select(adapter.adapter.name);
        onClose();
      } else {
        // Open deep link for mobile or extension install
        const option = WALLET_OPTIONS.find(o => o.name === walletName);
        if (option?.deepLink) {
          window.open(option.deepLink + encodeURIComponent(window.location.href), "_blank");
        }
      }
    } finally {
      setConnecting(null);
    }
  };

  const handleEvmWallet = async (option: WalletOption) => {
    setConnecting(option.name);
    try {
      const ethereum = (window as any).ethereum;
      if (ethereum && option.detectProvider?.()) {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        if (accounts?.[0]) {
          onEvmConnect(accounts[0], option.name);
          onClose();
          return;
        }
      }
      // Try generic ethereum provider
      if (ethereum) {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        if (accounts?.[0]) {
          onEvmConnect(accounts[0], option.name);
          onClose();
          return;
        }
      }
      // Fallback: open deep link
      if (option.deepLink) {
        window.open(option.deepLink + encodeURIComponent(window.location.href), "_blank");
      }
    } catch (err: any) {
      console.error("EVM wallet connection failed:", err);
    } finally {
      setConnecting(null);
    }
  };

  const handleConnect = (option: WalletOption) => {
    if (option.type === "solana") {
      handleSolanaWallet(option.name);
    } else {
      handleEvmWallet(option);
    }
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                <h3 className="font-display text-lg font-bold text-foreground">Connect Wallet</h3>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              Select your wallet to connect. Supports Solana and EVM-compatible wallets.
            </p>

            <div className="space-y-2">
              {WALLET_OPTIONS.map((option) => {
                const isDetected = option.detectProvider?.();
                return (
                  <button
                    key={option.name}
                    onClick={() => handleConnect(option)}
                    disabled={connecting !== null}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/40 hover:bg-muted/50 transition-all group"
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {option.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {option.type === "solana" ? "Solana" : "EVM"} • {isDetected ? "Detected" : "Install / Mobile"}
                      </p>
                    </div>
                    {connecting === option.name ? (
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : !isDetected ? (
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <p className="text-[10px] text-muted-foreground text-center mt-4">
              By connecting, you agree to the Terms of Service
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
