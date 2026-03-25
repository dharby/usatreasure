import coinImage from "@/assets/usat-coin.png";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={coinImage} alt="USAT" className="w-6 h-6" />
            <span className="font-display text-sm font-bold gold-gradient-text">USA TREASURE</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            © 2025 USA Treasure. Not financial advice. DYOR. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Docs</a>
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">Telegram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
