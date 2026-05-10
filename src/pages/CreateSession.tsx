import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, Check, ArrowRight, Sparkles, RefreshCw } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/axios";

const CreateSession = () => {
  const [codes, setCodes] = useState({ mentor: "", student: "" });
  const [loading, setLoading] = useState(true);

  const createSession = async () => {
    setLoading(true);
    try {
      const username = localStorage.getItem("username") || "User";
      const response = await api.post('/session/create', null, { params: { userId: username } });
      setCodes({
        mentor: response.data.mentorCode,
        student: response.data.studentCode
      });
      toast.success("Session created successfully!");
    } catch (error) {
      toast.error("Failed to create session.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    createSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="container py-16 flex-1 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container py-16 flex-1">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-muted-foreground mb-4">
            <Sparkles className="h-3 w-3 text-accent" /> Session ready
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient mb-3">Your session is live</h1>
          <p className="text-muted-foreground text-lg">Share these codes to invite mentors and students to your room.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          <CodeCard label="Mentor Code" code={codes.mentor} variant="primary" />
          <CodeCard label="Student Code" code={codes.student} variant="accent" />
        </div>

        <div className="max-w-4xl mx-auto mt-8 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <Button variant="ghost" onClick={createSession}>
            <RefreshCw className="h-4 w-4" /> Create new session
          </Button>
          <Button asChild variant="hero" size="lg">
            <Link to={`/session/${codes.mentor}`}>
              Enter session <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="max-w-2xl mx-auto mt-16 glass rounded-2xl p-6">
          <h3 className="font-semibold mb-2">How it works</h3>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3"><span className="grid h-6 w-6 place-items-center rounded-full bg-primary/20 text-primary text-xs font-bold flex-shrink-0">1</span> Copy the appropriate code for each role.</li>
            <li className="flex gap-3"><span className="grid h-6 w-6 place-items-center rounded-full bg-primary/20 text-primary text-xs font-bold flex-shrink-0">2</span> Share via email, chat or your LMS.</li>
            <li className="flex gap-3"><span className="grid h-6 w-6 place-items-center rounded-full bg-primary/20 text-primary text-xs font-bold flex-shrink-0">3</span> Start coding together in real time.</li>
          </ol>
        </div>
      </main>
    </div>
  );
};

const CodeCard = ({ label, code, variant }: { label: string; code: string; variant: "primary" | "accent" }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative glass gradient-border rounded-2xl p-8 overflow-hidden"
    >
      <div className={`absolute -top-20 -right-20 h-48 w-48 rounded-full blur-3xl opacity-30 ${variant === "primary" ? "bg-primary" : "bg-accent"}`} />
      <div className="relative">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
        <div className="mt-4 font-mono text-4xl md:text-5xl font-bold tracking-wider text-gradient">{code}</div>
        <Button onClick={copy} variant="glass" size="sm" className="mt-6">
          {copied ? <><Check className="h-4 w-4 text-success" /> Copied</> : <><Copy className="h-4 w-4" /> Copy code</>}
        </Button>
      </div>
    </motion.div>
  );
};

export default CreateSession;
