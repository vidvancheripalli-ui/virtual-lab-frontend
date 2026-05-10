import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/axios";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/signup";
      const payload = mode === "login" 
        ? { username, password } 
        : { username, email, password };
        
      const response = await api.post(endpoint, payload);
      
      if (mode === "login") {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", username);
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        toast.success("Account created! Please log in.");
        setMode("login");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left visual panel */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-primary p-12 items-center">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative text-primary-foreground">
          <Link to="/" className="inline-flex items-center gap-2 font-display font-bold text-xl mb-12">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-background/20 backdrop-blur">
              <Code2 className="h-4 w-4" />
            </span>
            Virtual Coding Lab
          </Link>
          <h2 className="font-display text-4xl font-bold leading-tight max-w-md">
            Code together. Learn faster. Resolve doubts in real time.
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-md">
            Join thousands of students and mentors collaborating live in shared coding sessions.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-md">
            {[
              { v: "60+", l: "Students" },
              { v: "10+", l: "Mentors" },
              { v: "24/7", l: "Available" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl bg-background/10 backdrop-blur p-4">
                <div className="text-2xl font-bold">{s.v}</div>
                <div className="text-xs opacity-80">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 font-display font-bold mb-8 text-gradient">
            <Code2 className="h-5 w-5 text-primary" /> Virtual Coding Lab
          </Link>

          <div className="inline-flex p-1 rounded-lg bg-secondary mb-8">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`relative px-5 py-2 text-sm font-medium rounded-md transition-colors ${
                  mode === m ? "text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {mode === m && (
                  <motion.span
                    layoutId="auth-pill"
                    className="absolute inset-0 bg-gradient-primary rounded-md shadow-glow"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <span className="relative">{m === "login" ? "Sign in" : "Sign up"}</span>
              </button>
            ))}
          </div>

          <h1 className="font-display text-3xl font-bold mb-2">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {mode === "login" ? "Sign in to continue your session." : "Start collaborating in seconds."}
          </p>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="aarav.dev" required className="pl-9 h-11 bg-secondary/50 border-border" />
                </div>
              </div>
              
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@college.edu" required className="pl-9 h-11 bg-secondary/50 border-border" />
                  </div>
                </div>
              )}
              
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" required className="pl-9 h-11 bg-secondary/50 border-border" />
                </div>
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full mt-2" disabled={loading}>
                {loading ? "Processing..." : (mode === "login" ? "Sign in" : "Create account")} <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.form>
          </AnimatePresence>

          <p className="text-xs text-muted-foreground text-center mt-8">
            Connected to Virtual Coding Lab Backend
          </p>
        </motion.div>
      </div>
    </div>
  );
};

const FieldWithIcon = ({
  icon: Icon, id, label, type = "text", placeholder,
}: { icon: React.ComponentType<{ className?: string }>; id: string; label: string; type?: string; placeholder?: string }) => (
  <div className="space-y-1.5">
    <Label htmlFor={id}>{label}</Label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input id={id} type={type} placeholder={placeholder} required className="pl-9 h-11 bg-secondary/50 border-border" />
    </div>
  </div>
);

export default Auth;
