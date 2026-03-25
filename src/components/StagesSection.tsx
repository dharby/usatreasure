import { motion } from "framer-motion";
import { Check, Lock, Zap } from "lucide-react";
import { PRESALE_STAGES, formatUSD, formatNumber } from "@/lib/presale-data";

export default function StagesSection() {
  return (
    <section id="stages" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
            <span className="gold-gradient-text">10 Presale Stages</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Early stages offer the lowest price and highest bonuses. Don't miss your window.
          </p>
        </motion.div>

        <div className="grid gap-3 max-w-4xl mx-auto">
          {PRESALE_STAGES.map((stage, i) => {
            const isSoldOut = stage.sold >= stage.allocation;
            const isActive = !isSoldOut && (i === 0 || PRESALE_STAGES[i - 1].sold >= PRESALE_STAGES[i - 1].allocation);
            const isLocked = !isSoldOut && !isActive;
            const progress = (stage.sold / stage.allocation) * 100;

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`glass-card p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 ${isActive ? "gold-border-glow border-primary/40" : ""} ${isSoldOut ? "opacity-60" : ""}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isSoldOut ? "bg-green-500/20" : isActive ? "gold-gradient-bg" : "bg-muted"}`}>
                  {isSoldOut ? <Check className="w-5 h-5 text-green-400" /> : isLocked ? <Lock className="w-4 h-4 text-muted-foreground" /> : <span className="text-sm font-bold text-primary-foreground">{stage.id}</span>}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-display font-semibold text-sm">{stage.name}</h4>
                    {isActive && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">LIVE</span>}
                    {isSoldOut && <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-medium">SOLD OUT</span>}
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full gold-gradient-bg rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs text-muted-foreground flex-shrink-0">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider">Price</p>
                    <p className="text-foreground font-semibold">{formatUSD(stage.price)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider">Allocation</p>
                    <p className="text-foreground">{formatNumber(stage.allocation)}</p>
                  </div>
                  {stage.bonus > 0 && (
                    <div className="flex items-center gap-1 text-primary">
                      <Zap className="w-3 h-3" />
                      <span className="font-semibold">+{stage.bonus}%</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
