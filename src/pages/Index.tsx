import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Code2, Users, MessageSquare, Zap, Sparkles, GitBranch, Terminal, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { CodePreview } from "@/components/CodePreview";

const stats = [
  { value: "60+", label: "Students per session", icon: Users },
  { value: "10+", label: "Active mentors", icon: Sparkles },
  { value: "Real-time", label: "Live collaboration", icon: Zap },
  { value: "Queue", label: "Doubt resolution", icon: ListOrdered },
];

const features = [
  { icon: Terminal, title: "Live editor", desc: "Multi-cursor coding with VS Code-grade syntax highlighting." },
  { icon: GitBranch, title: "Session codes", desc: "One-click mentor & student codes — share and start instantly." },
  { icon: MessageSquare, title: "Doubt queue", desc: "Students raise doubts; mentors resolve them in order." },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />

        <div className="container relative pt-20 pb-24 md:pt-28 md:pb-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-muted-foreground mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Live demo · v1.0
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              <span className="text-gradient">Virtual</span>
              <br />
              <span className="text-gradient-primary">Coding Lab</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Real-time coding collaboration for mentors and students. One link, infinite learning.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="hero" size="xl">
                <Link to="/create">
                  Create Session <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="glass" size="xl">
                <Link to="/join">Join Session</Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto"
          >
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-xl p-5 text-center hover:shadow-card transition-all">
                <s.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <div className="font-display text-2xl font-bold text-gradient">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Editor preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 max-w-5xl mx-auto"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-primary opacity-20 blur-3xl rounded-3xl" />
              <CodePreview />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-24">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Everything in one workspace</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gradient">Built for live classrooms</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative glass gradient-border rounded-2xl p-6 hover:shadow-elevated transition-all duration-500"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary shadow-glow mb-5">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="relative overflow-hidden rounded-3xl glass p-12 md:p-16 text-center">
          <div className="absolute inset-0 bg-gradient-primary opacity-10" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-gradient mb-4">
              Ready to launch your first session?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Spin up a room in seconds and bring your students together — no install required.
            </p>
            <Button asChild variant="hero" size="xl">
              <Link to="/auth">
                Get started free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary" />
            <span>Virtual Coding Lab · College demo project</span>
          </div>
          <div>© {new Date().getFullYear()} VCL. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
