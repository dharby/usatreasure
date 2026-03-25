import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Wallet, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import coinImage from "@/assets/usat-coin.png";

interface HeaderProps {
  walletConnected: boolean;
  walletAddress: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export default function Header({ walletConnected, walletAddress, onConnect, onDisconnect }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = ["Presale", "Tokenomics", "Stages", "Dashboard"];

  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={coinImage} alt="USAT" className="w-8 h-8" />
          <span className="font-display text-lg font-bold gold-gradient-text">USA TREASURE</span>
          <span className="text-xs text-muted-foreground ml-1">$USAT</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(item => (
            <button key={item} onClick={() => scrollTo(item)} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {walletConnected ? (
            <Button variant="outline" size="sm" onClick={onDisconnect} className="border-primary/30 text-primary hover:bg-primary/10">
              <Wallet className="w-4 h-4 mr-2" />
              {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
            </Button>
          ) : (
            <Button size="sm" onClick={onConnect} className="gold-gradient-bg text-primary-foreground font-semibold hover:opacity-90">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          )}
          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border/40 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navItems.map(item => (
                <button key={item} onClick={() => scrollTo(item)} className="text-left text-sm text-muted-foreground hover:text-primary py-2">
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
