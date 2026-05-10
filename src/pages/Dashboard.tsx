import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PlusCircle, LogIn, ArrowRight, Activity } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const options = [
  {
    to: "/create",
    icon: PlusCircle,
    title: "Create Session",
    desc: "Start a new coding lab and invite your class with shareable codes.",
    accent: "from-primary to-primary-glow",
  },
  {
    to: "/join",
    icon: LogIn,
    title: "Join Session",
    desc: "Got a session code? Hop in instantly as a mentor or student.",
    accent: "from-accent to-primary",
  },
];

const Dashboard = () => {
  const username = localStorage.getItem("username") || "User";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container py-16 md:py-24 flex-1">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full glass text-muted-foreground mb-4">
            <Activity className="h-3 w-3 text-success" /> Connected
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient">
            Welcome back, {username} 👋
          </h1>
          <p className="mt-3 text-muted-foreground text-lg">
            What would you like to do today?
          </p>
        </motion.div>

        <div className="mt-12 grid md:grid-cols-2 gap-5 max-w-4xl">
          {options.map((o, i) => (
            <motion.div
              key={o.to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
            >
              <Link
                to={o.to}
                className="group relative block overflow-hidden glass gradient-border rounded-2xl p-8 hover:shadow-elevated transition-all duration-500 hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${o.accent} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                <div className="relative">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary shadow-glow mb-6">
                    <o.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h2 className="font-display text-2xl font-semibold mb-2">{o.title}</h2>
                  <p className="text-muted-foreground mb-6">{o.desc}</p>
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                    Continue <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent activity strip */}
        <div className="mt-16 max-w-4xl">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Recent sessions</h3>
          <div className="glass rounded-2xl divide-y divide-border/60">
            {[
              { name: "Algorithms Workshop", code: "ALG-9X2K", role: "Mentor", time: "2h ago" },
              { name: "React Fundamentals", code: "RCT-44ZQ", role: "Student", time: "yesterday" },
              { name: "DBMS Doubt Hour", code: "DBM-7P1L", role: "Student", time: "3 days ago" },
            ].map((s) => (
              <div key={s.code} className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors">
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">{s.code}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs px-2 py-1 rounded-md bg-secondary">{s.role}</span>
                  <span className="text-xs text-muted-foreground">{s.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
