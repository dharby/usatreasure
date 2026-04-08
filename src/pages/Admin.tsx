import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, LogOut, Settings, Coins, Clock, Save, Eye, EyeOff, Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { SUPPORTED_CURRENCIES, SupportedCurrency, formatNumber } from "@/lib/presale-data";
import { getInvestors, saveInvestors, InvestorPurchase } from "@/lib/investor-store";

const ADMIN_PASSWORD = "usatadmin2025";
const STORAGE_KEY = "usat_admin_config";

interface PresaleConfig {
  solPriceUsd: number;
  treasuryAddress: string;
  stageEndDate: string;
  stages: { id: number; name: string; price: number; allocation: number; sold: number; bonus: number }[];
}

const DEFAULT_CONFIG: PresaleConfig = {
  solPriceUsd: 178.5,
  treasuryAddress: "CGA587QFDvWwJeVhgQ8X3RfG3gKcm5SSv7ERzwxujBVv",
  stageEndDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16),
  stages: [
    { id: 1, name: "Eagle", price: 0.0005, allocation: 50000000, sold: 50000000, bonus: 50 },
    { id: 2, name: "Liberty", price: 0.001, allocation: 50000000, sold: 50000000, bonus: 40 },
    { id: 3, name: "Freedom", price: 0.002, allocation: 50000000, sold: 38750000, bonus: 35 },
    { id: 4, name: "Patriot", price: 0.004, allocation: 50000000, sold: 0, bonus: 30 },
    { id: 5, name: "Sentinel", price: 0.008, allocation: 50000000, sold: 0, bonus: 25 },
    { id: 6, name: "Guardian", price: 0.015, allocation: 40000000, sold: 0, bonus: 20 },
    { id: 7, name: "Sovereign", price: 0.025, allocation: 40000000, sold: 0, bonus: 15 },
    { id: 8, name: "Dominion", price: 0.040, allocation: 30000000, sold: 0, bonus: 10 },
    { id: 9, name: "Empire", price: 0.065, allocation: 20000000, sold: 0, bonus: 5 },
    { id: 10, name: "Apex", price: 0.100, allocation: 20000000, sold: 0, bonus: 0 },
  ],
};

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("usat_admin_auth", "true");
      onLogin();
      toast.success("Logged in as admin");
    } else {
      toast.error("Invalid password");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full gold-gradient-bg flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="font-display text-xl font-bold gold-gradient-text">Admin Access</h1>
          <p className="text-sm text-muted-foreground mt-1">USA TREASURE Control Panel</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-muted/50 border-border/50 pr-10"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <Button type="submit" className="w-full gold-gradient-bg text-primary-foreground font-semibold">Login</Button>
        </form>
      </motion.div>
    </div>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [config, setConfig] = useState<PresaleConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });
  const [investors, setInvestors] = useState<InvestorPurchase[]>(getInvestors);
  const [tab, setTab] = useState<"config" | "investors">("config");

  // New investor form
  const [newWallet, setNewWallet] = useState("");
  const [newCurrency, setNewCurrency] = useState<SupportedCurrency>("SOL");
  const [newAmount, setNewAmount] = useState("");
  const [newSolEq, setNewSolEq] = useState("");
  const [newStage, setNewStage] = useState("3");
  const [newNote, setNewNote] = useState("");

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    toast.success("Configuration saved!");
  };

  const updateStage = (index: number, field: string, value: number) => {
    const stages = [...config.stages];
    stages[index] = { ...stages[index], [field]: value };
    setConfig({ ...config, stages });
  };

  const handleAddInvestor = () => {
    if (!newWallet || !newAmount || !newSolEq) {
      toast.error("Fill in wallet, amount, and SOL equivalent"); return;
    }
    const stageNum = parseInt(newStage);
    const stage = config.stages.find(s => s.id === stageNum) || config.stages[0];
    const solEq = parseFloat(newSolEq);
    const usdValue = solEq * config.solPriceUsd;
    const baseTokens = Math.floor(usdValue / stage.price);
    const bonusEligible = solEq >= 5;
    const bonusTokens = bonusEligible ? Math.floor(baseTokens * (stage.bonus / 100)) : 0;

    const purchase: InvestorPurchase = {
      id: crypto.randomUUID(),
      walletAddress: newWallet.trim(),
      currency: newCurrency,
      amount: parseFloat(newAmount),
      solEquivalent: solEq,
      tokensBase: baseTokens,
      tokensBonus: bonusTokens,
      tokensTotal: baseTokens + bonusTokens,
      stage: stageNum,
      date: new Date().toISOString().slice(0, 10),
      note: newNote || undefined,
    };
    const updated = [...investors, purchase];
    setInvestors(updated);
    saveInvestors(updated);
    setNewWallet(""); setNewAmount(""); setNewSolEq(""); setNewNote("");
    toast.success(`Added ${formatNumber(purchase.tokensTotal)} USAT for ${newWallet.slice(0, 8)}...`);
  };

  const handleRemoveInvestor = (id: string) => {
    const updated = investors.filter(i => i.id !== id);
    setInvestors(updated);
    saveInvestors(updated);
    toast.success("Purchase removed");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <span className="font-display font-bold gold-gradient-text">USAT Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setTab("config")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === "config" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              <Settings className="w-3 h-3 inline mr-1" />Config
            </button>
            <button onClick={() => setTab("investors")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === "investors" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              <Users className="w-3 h-3 inline mr-1" />Investors ({investors.length})
            </button>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-muted-foreground hover:text-foreground ml-2">
              <LogOut className="w-4 h-4 mr-2" />Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {tab === "config" ? (
          <>
            <div className="glass-card p-6">
              <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />General Settings
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">SOL Price (USD)</label>
                  <Input type="number" value={config.solPriceUsd} onChange={(e) => setConfig({ ...config, solPriceUsd: parseFloat(e.target.value) || 0 })} className="bg-muted/50 border-border/50" step="0.01" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Treasury Address</label>
                  <Input value={config.treasuryAddress} onChange={(e) => setConfig({ ...config, treasuryAddress: e.target.value })} className="bg-muted/50 border-border/50" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1"><Clock className="w-3 h-3" /> Stage End Date</label>
                  <Input type="datetime-local" value={config.stageEndDate} onChange={(e) => setConfig({ ...config, stageEndDate: e.target.value })} className="bg-muted/50 border-border/50" />
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-display font-semibold text-lg mb-4">Presale Stages</h2>
              <div className="space-y-3">
                {config.stages.map((stage, i) => (
                  <div key={stage.id} className="p-4 bg-muted/30 rounded-xl grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
                    <div>
                      <label className="text-[10px] text-muted-foreground uppercase">Stage {stage.id}: {stage.name}</label>
                      <Input type="number" value={stage.price} onChange={(e) => updateStage(i, "price", parseFloat(e.target.value) || 0)} className="bg-muted/50 border-border/50 h-9 text-sm" step="0.0001" />
                      <span className="text-[10px] text-muted-foreground">Price (USD)</span>
                    </div>
                    <div>
                      <Input type="number" value={stage.allocation} onChange={(e) => updateStage(i, "allocation", parseInt(e.target.value) || 0)} className="bg-muted/50 border-border/50 h-9 text-sm" />
                      <span className="text-[10px] text-muted-foreground">Allocation</span>
                    </div>
                    <div>
                      <Input type="number" value={stage.sold} onChange={(e) => updateStage(i, "sold", parseInt(e.target.value) || 0)} className="bg-muted/50 border-border/50 h-9 text-sm" />
                      <span className="text-[10px] text-muted-foreground">Sold</span>
                    </div>
                    <div>
                      <Input type="number" value={stage.bonus} onChange={(e) => updateStage(i, "bonus", parseInt(e.target.value) || 0)} className="bg-muted/50 border-border/50 h-9 text-sm" min="0" max="100" />
                      <span className="text-[10px] text-muted-foreground">Bonus %</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${stage.sold >= stage.allocation ? "bg-green-400" : stage.sold > 0 ? "bg-primary" : "bg-muted-foreground/30"}`} />
                      <span className="text-xs text-muted-foreground">{stage.sold >= stage.allocation ? "Sold Out" : stage.sold > 0 ? "Active" : "Locked"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={handleSave} className="w-full gold-gradient-bg text-primary-foreground font-semibold h-12">
              <Save className="w-4 h-4 mr-2" />Save Configuration
            </Button>
          </>
        ) : (
          <>
            {/* Add Investor */}
            <div className="glass-card p-6">
              <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />Add Verified Purchase
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs text-muted-foreground mb-1 block">Wallet Address</label>
                  <Input value={newWallet} onChange={e => setNewWallet(e.target.value)} placeholder="Wallet address that sent the deposit" className="bg-muted/50 border-border/50" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Currency</label>
                  <select value={newCurrency} onChange={e => setNewCurrency(e.target.value as SupportedCurrency)} className="w-full h-10 rounded-md bg-muted/50 border border-border/50 px-3 text-sm text-foreground">
                    {SUPPORTED_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Amount ({newCurrency})</label>
                  <Input type="number" value={newAmount} onChange={e => setNewAmount(e.target.value)} placeholder="0.00" className="bg-muted/50 border-border/50" step="0.01" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">SOL Equivalent</label>
                  <Input type="number" value={newSolEq} onChange={e => setNewSolEq(e.target.value)} placeholder="0.00" className="bg-muted/50 border-border/50" step="0.01" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Stage</label>
                  <select value={newStage} onChange={e => setNewStage(e.target.value)} className="w-full h-10 rounded-md bg-muted/50 border border-border/50 px-3 text-sm text-foreground">
                    {config.stages.map(s => <option key={s.id} value={s.id}>Stage {s.id}: {s.name}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-muted-foreground mb-1 block">Note (optional)</label>
                  <Input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Transaction hash or note" className="bg-muted/50 border-border/50" />
                </div>
              </div>
              <Button onClick={handleAddInvestor} className="mt-4 gold-gradient-bg text-primary-foreground font-semibold">
                <Plus className="w-4 h-4 mr-2" />Add Purchase
              </Button>
            </div>

            {/* Investor list */}
            <div className="glass-card p-6">
              <h2 className="font-display font-semibold text-lg mb-4">Verified Purchases ({investors.length})</h2>
              {investors.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No verified purchases yet</p>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {investors.map(inv => (
                    <div key={inv.id} className="p-3 bg-muted/30 rounded-lg flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{inv.walletAddress}</p>
                        <p className="text-xs text-muted-foreground">
                          {inv.amount} {inv.currency} ({inv.solEquivalent.toFixed(2)} SOL) → {formatNumber(inv.tokensTotal)} USAT • Stage {inv.stage} • {inv.date}
                        </p>
                        {inv.note && <p className="text-[10px] text-muted-foreground/70 truncate">{inv.note}</p>}
                      </div>
                      <button onClick={() => handleRemoveInvestor(inv.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem("usat_admin_auth") === "true");

  const handleLogout = () => {
    sessionStorage.removeItem("usat_admin_auth");
    setAuthenticated(false);
    toast.info("Logged out");
  };

  if (!authenticated) return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  return <AdminDashboard onLogout={handleLogout} />;
}
