import { useState, useCallback } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PresaleCard from "@/components/PresaleCard";
import StagesSection from "@/components/StagesSection";
import TokenomicsSection from "@/components/TokenomicsSection";
import DashboardSection from "@/components/DashboardSection";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const Index = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const handleConnect = useCallback(() => {
    // Simulate wallet connection
    const mockAddress = "7xKXt" + Math.random().toString(36).slice(2, 6) + "...q3Fm";
    setWalletAddress(mockAddress);
    setWalletConnected(true);
    toast.success("Wallet connected successfully!");
  }, []);

  const handleDisconnect = useCallback(() => {
    setWalletConnected(false);
    setWalletAddress("");
    toast.info("Wallet disconnected");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header
        walletConnected={walletConnected}
        walletAddress={walletAddress}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />
      <HeroSection />
      <PresaleCard walletConnected={walletConnected} onConnect={handleConnect} />
      <StagesSection />
      <TokenomicsSection />
      <DashboardSection walletConnected={walletConnected} onConnect={handleConnect} />
      <Footer />
    </div>
  );
};

export default Index;
