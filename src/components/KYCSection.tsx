import { useState } from "react";
import { motion } from "framer-motion";
import { UserCheck, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function KYCSection() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail) return;

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("kyc_submissions")
        .insert({ full_name: trimmedName, email: trimmedEmail });

      if (error) throw error;
      setSubmitted(true);
      toast.success("KYC submitted successfully!");
      setFullName("");
      setEmail("");
    } catch (err: any) {
      toast.error("Failed to submit KYC. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="kyc" className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
            <span className="gold-gradient-text">Quick KYC</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Complete a short verification to participate in the presale
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card gold-border-glow max-w-md mx-auto p-6"
        >
          {submitted ? (
            <div className="text-center py-4">
              <UserCheck className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="font-display text-lg font-bold text-foreground mb-2">KYC Submitted!</h3>
              <p className="text-sm text-muted-foreground mb-4">Thank you for completing your verification.</p>
              <Button
                onClick={() => setSubmitted(false)}
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                Submit Another
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="w-5 h-5 text-primary" />
                <h3 className="font-display text-lg font-bold text-foreground">Verify Your Identity</h3>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="w-3 h-3" /> Full Name
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-muted/50 border-border/50"
                  maxLength={100}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-muted/50 border-border/50"
                  maxLength={255}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={!fullName.trim() || !email.trim() || loading}
                className="w-full gold-gradient-bg text-primary-foreground font-semibold"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <UserCheck className="w-4 h-4 mr-2" />
                )}
                Submit KYC
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
