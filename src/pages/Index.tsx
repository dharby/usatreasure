import { useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PresaleCard from "@/components/PresaleCard";
import StagesSection from "@/components/StagesSection";
import TokenomicsSection from "@/components/TokenomicsSection";
import DashboardSection from "@/components/DashboardSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const Index = () => {
  const { publicKey, connected, connect, disconnect, select, wallets } = useWallet();

  const walletAddress = publicKey ? publicKey.toBase58() : "";

  const handleConnect = useCallback(async () => {
    try {
      if (wallets.length > 0 && !publicKey) {
        select(wallets[0].adapter.name);
        await connect();
      }
      toast.success("Wallet connected successfully!");
    } catch {
      toast.error("Failed to connect wallet. Please install Phantom or Solflare.");
    }
  }, [wallets, publicKey, select, connect]);

  const handleDisconnect = useCallback(async () => {
    await disconnect();
    toast.info("Wallet disconnected");
  }, [disconnect]);

  return (
    <div className="min-h-screen bg-background">
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
      <DashboardSection walletConnected={connected} onConnect={handleConnect} />
      <Footer />
    </div>
  );
};

export default Index;
