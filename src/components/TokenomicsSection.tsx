import { motion } from "framer-motion";
import { formatNumber } from "@/lib/presale-data";
import { usePresaleConfig } from "@/lib/presale-config-context";

export default function TokenomicsSection() {
  const { tokenomics, totalSupply } = usePresaleConfig();

  return (
    <section id="tokenomics" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
            <span className="gold-gradient-text">Tokenomics</span>
          </h2>
          <p className="text-muted-foreground">
            Total Supply: <span className="text-foreground font-semibold">{formatNumber(totalSupply)} USAT</span>
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto grid gap-3">
          {tokenomics.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-4 flex items-center gap-4"
            >
              <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-sm font-medium flex-1">{item.label}</span>
              <div className="flex-1 max-w-[200px]">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  />
                </div>
              </div>
              <span className="text-sm font-bold text-primary w-12 text-right">{item.percentage}%</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
