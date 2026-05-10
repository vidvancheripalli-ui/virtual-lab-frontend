import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, GraduationCap, Briefcase, RefreshCw } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/axios";

const JoinSession = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const detectedRole = code.startsWith("MNT") ? "mentor" : code.startsWith("STU") ? "student" : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detectedRole) {
      toast.error("Invalid code. Use a code starting with MNT- or STU-.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post('/session/join', null, { params: { code } });
      const role = response.data.role;
      toast.success(`Joining as ${role.toLowerCase()}…`);
      navigate(`/session/${code}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to join session. Please check your code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container py-16 flex-1 flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="text-center mb-8">
            <div className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary shadow-glow mb-5">
              <LogIn className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="font-display text-4xl font-bold text-gradient mb-2">Join a Session</h1>
            <p className="text-muted-foreground">Enter the code your mentor shared with you.</p>
          </div>

          <form onSubmit={handleSubmit} className="glass gradient-border rounded-2xl p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="code">Session Code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="MNT-A1B2C3"
                className="h-14 text-center font-mono text-xl tracking-widest bg-secondary/50"
                maxLength={10}
                required
              />
            </div>

            {detectedRole && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-3 p-3 rounded-lg ${detectedRole === "mentor" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}
              >
                {detectedRole === "mentor" ? <Briefcase className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
                <span className="text-sm font-medium">Detected role: <span className="capitalize font-bold">{detectedRole}</span></span>
              </motion.div>
            )}

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : "Join Session"}
            </Button>
          </form>

          <div className="mt-8 text-center text-xs text-muted-foreground">
            Tip: try <code className="px-1.5 py-0.5 rounded bg-secondary text-foreground font-mono">MNT-DEMO1</code> or <code className="px-1.5 py-0.5 rounded bg-secondary text-foreground font-mono">STU-DEMO1</code>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default JoinSession;
