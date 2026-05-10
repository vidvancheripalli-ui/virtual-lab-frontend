import { Link, useLocation } from "react-router-dom";
import { Code2, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Product" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/create", label: "Create" },
  { to: "/join", label: "Join" },
];

export const Navbar = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-xl border-b border-border/50" />
      <nav className="container relative flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary shadow-glow">
            <Code2 className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="text-gradient">Virtual Coding Lab</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === l.to ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button asChild variant="hero" size="sm">
            <Link to="/auth">Get started →</Link>
          </Button>
        </div>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden relative border-b border-border/50 bg-background/95 backdrop-blur-xl">
          <div className="container flex flex-col gap-1 py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}
            <Button asChild variant="hero" size="sm" className="mt-2">
              <Link to="/auth" onClick={() => setOpen(false)}>Get started</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
