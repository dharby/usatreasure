import { motion } from "framer-motion";

export default function TechBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Scanning line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
        animate={{ y: ["0vh", "100vh"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Data stream particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px bg-gradient-to-b from-transparent via-primary/15 to-transparent"
          style={{
            left: `${15 + i * 15}%`,
            height: "120px",
          }}
          animate={{ y: ["-120px", "100vh"] }}
          transition={{
            duration: 4 + i * 1.5,
            repeat: Infinity,
            delay: i * 1.2,
            ease: "linear",
          }}
        />
      ))}

      {/* Corner accents */}
      <div className="absolute top-20 left-4 w-16 h-16 border-l border-t border-primary/10 rounded-tl-lg" />
      <div className="absolute top-20 right-4 w-16 h-16 border-r border-t border-primary/10 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l border-b border-primary/10 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r border-b border-primary/10 rounded-br-lg" />

      {/* Hex pattern dots */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-1 h-1 rounded-full bg-primary/10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ opacity: [0.05, 0.25, 0.05] }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
}
