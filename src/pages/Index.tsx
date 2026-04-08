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
import { toast } from "sonner";

const Index = () => {
  const { publicKey, connected: solConnected, disconnect: solDisconnect } = useWallet();
  const [evmAddress, setEvmAddress] = useState<string | null>(null);
  const [evmWalletName, setEvmWalletName] = useState<string>("");
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  const connected = solConnected || !!evmAddress;
  const walletAddress = publicKey ? publicKey.toBase58() : evmAddress || "";

  const handleConnect = useCallback(() => {
    setWalletModalOpen(true);
  }, []);

  const handleEvmConnect = useCallback((address: string, walletName: string) => {
    setEvmAddress(address);
    setEvmWalletName(walletName);
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
    toast.info("Wallet disconnected");
  }, [solConnected, solDisconnect, evmAddress]);

  return (
    <div className="min-h-screen bg-background relative">
      <TechBackground />
      <FloatingFlags />
      <div className="relative z-10">
        <Header
          walletConnected={connected}
          walletAddress={walletAddress}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />
        <HeroSection />
        <PresaleCard walletConnected={connected} onConnect={handleConnect} />
        <StagesSection />
        <TokenomicsSection />
        <DashboardSection walletConnected={connected} walletAddress={walletAddress} onConnect={handleConnect} />
        <FAQSection />
        <Footer />
      </div>
      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        onEvmConnect={handleEvmConnect}
      />
    </div>
  );
};

export default Index;
