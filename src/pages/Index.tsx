import { useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
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
import { toast } from "sonner";

const Index = () => {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  const walletAddress = publicKey ? publicKey.toBase58() : "";

  const handleConnect = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const handleDisconnect = useCallback(async () => {
    await disconnect();
    toast.info("Wallet disconnected");
  }, [disconnect]);

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
    </div>
  );
};

export default Index;
