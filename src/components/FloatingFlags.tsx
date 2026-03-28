import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FlagParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  direction: number; // -1 left, 1 right
  emoji: string;
}

const FLAG_EMOJIS = ["🇺🇸"];

export default function FloatingFlags() {
  const [particles, setParticles] = useState<FlagParticle[]>([]);
  const [counter, setCounter] = useState(0);

  const createParticle = useCallback(() => {
    const direction = Math.random() > 0.5 ? 1 : -1;
    return {
      id: Date.now() + Math.random(),
      x: direction === 1 ? -5 : 105,
      y: Math.random() * 80 + 10,
      size: Math.random() * 16 + 14,
      duration: Math.random() * 8 + 10,
      delay: 0,
      direction,
      emoji: FLAG_EMOJIS[0],
    };
  }, []);

  useEffect(() => {
    // Initial batch
    const initial: FlagParticle[] = Array.from({ length: 5 }, () => ({
      ...createParticle(),
      delay: Math.random() * 6,
    }));
    setParticles(initial);

    const interval = setInterval(() => {
      setCounter((c) => c + 1);
      setParticles((prev) => {
        const filtered = prev.length > 12 ? prev.slice(-10) : prev;
        return [...filtered, createParticle()];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [createParticle]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              x: `${p.x}vw`,
              y: `${p.y}vh`,
              opacity: 0,
              rotate: p.direction === 1 ? -20 : 20,
            }}
            animate={{
              x: `${p.direction === 1 ? 110 : -10}vw`,
              y: `${p.y + (Math.random() * 20 - 10)}vh`,
              opacity: [0, 0.35, 0.35, 0],
              rotate: p.direction === 1 ? 20 : -20,
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: "linear",
            }}
            style={{ fontSize: p.size, position: "absolute" }}
          >
            {p.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
