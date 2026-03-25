import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: Date;
  label?: string;
}

export default function CountdownTimer({ targetDate, label = "Stage Ends In" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="mb-6">
      <p className="text-xs text-muted-foreground mb-2 text-center">{label}</p>
      <div className="grid grid-cols-4 gap-2">
        {(["days", "hours", "minutes", "seconds"] as const).map((unit) => (
          <div key={unit} className="bg-muted/50 rounded-lg p-2 text-center border border-border/30">
            <p className="text-xl font-bold gold-gradient-text font-display">
              {String(timeLeft[unit]).padStart(2, "0")}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{unit}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}
