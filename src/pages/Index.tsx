import { useCallback, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PresaleCard from "@/components/PresaleCard";
import StagesSection from "@/components/StagesSection";
import TokenomicsSection from "@/components/TokenomicsSection";
import DashboardSection from "@/components/DashboardSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import FloatingFlags from "@/components/FloatingFlags";
import TechBackground from "@/components/TechBackground";
import WalletModal from "@/components/WalletModal";
import VerifyPurchaseModal from "@/components/VerifyPurchaseModal";
import { toast } from "sonner";

const Index = () => {
  const { publicKey, connected: solConnected, disconnect: solDisconnect } = useWallet();
  const [evmAddress, setEvmAddress] = useState<string | null>(null);
  const [evmWalletName, setEvmWalletName] = useState<string>("");
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [manualWallet, setManualWallet] = useState<string | null>(null);

  const connected = solConnected || !!evmAddress;
  const walletAddress = publicKey ? publicKey.toBase58() : evmAddress || manualWallet || "";

  const handleConnect = useCallback(() => {
    setWalletModalOpen(true);
  }, []);

  const handleEvmConnect = useCallback((address: string, walletName: string) => {
    setEvmAddress(address);
    setEvmWalletName(walletName);
    setManualWallet(null);
    toast.success(`${walletName} connected: ${address.slice(0, 6)}...${address.slice(-4)}`);
  }, []);

  const handleDisconnect = useCallback(async () => {
    if (solConnected) {
      await solDisconnect();
    }
    if (evmAddress) {
      setEvmAddress(null);
      setEvmWalletName("");
    }
    setManualWallet(null);
    toast.info("Wallet disconnected");
  }, [solConnected, solDisconnect, evmAddress]);

  const handleVerifyPurchase = useCallback(() => {
    setVerifyModalOpen(true);
  }, []);

  const handleManualWalletVerify = useCallback((address: string) => {
    setManualWallet(address);
    toast.success(`Looking up purchases for ${address.slice(0, 6)}...${address.slice(-4)}`);
    // Scroll to dashboard
    setTimeout(() => {
      document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <TechBackground />
      <FloatingFlags />
      <div className="relative z-10">
        <Header
          walletConnected={connected || !!manualWallet}
          walletAddress={walletAddress}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          onVerifyPurchase={handleVerifyPurchase}
        />
        <HeroSection />
        <PresaleCard walletConnected={connected} onConnect={handleConnect} />
        <StagesSection />
        <TokenomicsSection />
        <DashboardSection
          walletConnected={connected || !!manualWallet}
          walletAddress={walletAddress}
          onConnect={handleConnect}
          onVerifyPurchase={handleVerifyPurchase}
        />
        <FAQSection />
        <Footer />
      </div>
      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        onEvmConnect={handleEvmConnect}
      />
      <VerifyPurchaseModal
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        onVerify={handleManualWalletVerify}
      />
    </div>
  );
};

export default Index;
