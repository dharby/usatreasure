import { motion } from "framer-motion";
import { Copy, Check, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TREASURY_ADDRESSES, SUPPORTED_CURRENCIES, SupportedCurrency, MIN_SOL, MAX_SOL } from "@/lib/presale-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    question: "How do I buy $USAT tokens?",
    answer: "how-to-buy",
  },
  {
    question: "What is the USA TREASURE ($USAT) presale?",
    answer:
      "The $USAT presale is a multi-stage token sale event with 10 stages, each offering tokens at progressively higher prices. Early participants benefit from lower prices and bonus token allocations. The presale distributes 400 million tokens (40% of total supply) across all stages.",
  },
  {
    question: "What currencies can I use to purchase?",
    answer:
      "You can purchase $USAT using SOL, ETH, BNB, USDT, TRX, or BTC. The system automatically converts all currencies to SOL equivalent to calculate your token allocation. Each currency has its own dedicated treasury address.",
  },
  {
    question: "What are the purchase limits?",
    answer:
      `Minimum purchase is equivalent to ${MIN_SOL} SOL and maximum is ${MAX_SOL} SOL, regardless of which currency you use. The system automatically calculates the equivalent amounts in your selected currency based on real-time market prices.`,
  },
  {
    question: "How does the token pricing work across stages?",
    answer:
      "Token prices increase with each stage — starting at $0.0005 in Stage 1 (Eagle) and reaching $0.100 in Stage 10 (Apex). Earlier stages also offer higher bonus percentages, from 50% in Stage 1 down to 0% in Stage 10. Once a stage sells out, the next stage begins automatically.",
  },
  {
    question: "How do I receive my $USAT tokens after purchase?",
    answer:
      "Once your deposit is confirmed in the treasury, your $USAT tokens are automatically airdropped to the same wallet address you sent from. There is no manual claim process — it's fully automated.",
  },
  {
    question: "When can I trade my $USAT tokens?",
    answer:
      "Tokens can be traded once the presale concludes and the listing phase commences. During the presale period, tokens are held in your wallet but are not yet tradeable. Listing details and exchange information will be announced through our official channels.",
  },
  {
    question: "What is the tokenomics breakdown?",
    answer:
      "Total supply is 1 billion $USAT tokens: 40% Presale, 25% Liquidity Pool, 10% Team & Advisors (vested), 10% Marketing, 10% Ecosystem Development, and 5% Reserve. This structure ensures long-term sustainability and growth.",
  },
  {
    question: "Is there a minimum purchase for the bonus?",
    answer:
      `A minimum deposit equivalent to ${MIN_SOL} SOL is required to receive the stage bonus tokens added to your airdrop. Purchases below ${MIN_SOL} SOL equivalent will still receive base tokens, but will not qualify for the bonus allocation.`,
  },
  {
    question: "What wallets are supported?",
    answer:
      "We support Phantom, Solflare, MetaMask, Trust Wallet, SafePal, and many more through the WalletConnect protocol. Connect your wallet directly through our website, or send crypto directly to the appropriate treasury address.",
  },
  {
    question: "Is my investment safe?",
    answer:
      "The treasury addresses are publicly verifiable on their respective blockchains. All transactions are transparent and traceable. However, as with all crypto investments, please do your own research (DYOR) and only invest what you can afford to lose.",
  },
];

export default function FAQSection() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (currency: SupportedCurrency) => {
    const addr = TREASURY_ADDRESSES[currency];
    navigator.clipboard.writeText(addr);
    setCopied(currency);
    toast.success(`${currency} treasury address copied!`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section id="faq" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold gold-gradient-text mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about the $USAT presale
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="glass-card gold-border-glow p-6 sm:p-8">
            <Accordion type="single" collapsible className="w-full">
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-border/30">
                  <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline text-sm sm:text-base">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {item.answer === "how-to-buy" ? (
                      <div className="space-y-4 text-muted-foreground text-sm">
                        <p>
                          Select your preferred currency (SOL, ETH, BNB, USDT, TRX, or BTC) and deposit into the corresponding treasury address below. Your $USAT tokens will be automatically airdropped to your wallet.
                        </p>
                        <p>
                          <strong className="text-primary">Minimum purchase: {MIN_SOL} SOL equivalent</strong> to qualify for bonus tokens. <strong>Maximum: {MAX_SOL} SOL equivalent.</strong>
                        </p>

                        <div className="space-y-2">
                          {Object.entries(TREASURY_ADDRESSES).map(([currency, addr]) => (
                            <div key={currency} className="p-3 bg-muted/30 rounded-xl border border-border/50">
                              <p className="text-xs text-muted-foreground mb-1">{currency} Treasury</p>
                              <div className="flex items-center gap-2">
                                <code className="text-[11px] text-foreground flex-1 truncate font-mono">{addr}</code>
                                <button
                                  onClick={() => handleCopy(currency as SupportedCurrency)}
                                  className="shrink-0 p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors"
                                >
                                  {copied === currency ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                          <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                          <p className="text-xs text-destructive">
                            <strong>Warning:</strong> Do NOT deposit into the contract address. Funds sent to the contract address are non-refundable and your purchase will not be completed.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">{item.answer}</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
