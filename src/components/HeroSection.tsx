import { motion } from "framer-motion";
import { ArrowDown, Shield, TrendingUp, Users } from "lucide-react";
import coinImage from "@/assets/usat-coin.png";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(42_60%_58%_/_0.04)_0%,_transparent_70%)]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-primary font-medium">Stage 3 — LIVE NOW</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="text-foreground">The Nation's</span>
                <br />
                <span className="gold-gradient-text">Digital Treasure</span>
              </h1>

              <p className="text-muted-foreground text-lg max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Secure your allocation in the most anticipated Solana presale. 10 stages, increasing prices, exclusive bonuses for early participants.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10">
                {[
                  { icon: Shield, text: "Audited Contract" },
                  { icon: Users, text: "2,847 Holders" },
                  { icon: TrendingUp, text: "30x Potential" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="w-4 h-4 text-primary" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <motion.button
                onClick={() => document.getElementById("presale")?.scrollIntoView({ behavior: "smooth" })}
                className="gold-gradient-bg px-8 py-3.5 rounded-xl font-semibold text-primary-foreground hover:opacity-90 transition-opacity pulse-gold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Join Presale Now
              </motion.button>
            </motion.div>
          </div>

          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl animate-pulse" />
              <motion.img
                src={coinImage}
                alt="USAT Token"
                className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
                animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </div>
    </section>
  );
}
