import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  Sun,
  Moon,
  Menu,
  X,
  Activity,
  Search,
  BookOpen,
  History,
  Info,
} from "lucide-react";
import { api } from "../services/api";
import type { HealthResponse } from "../types";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  isDark,
  onToggleTheme,
}) => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [isHealthLoading, setIsHealthLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkServiceHealth = async () => {
      try {
        const h = await api.checkHealth();
        if (isMounted) {
          setHealth(h);
          setIsHealthLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setHealth(null);
          setIsHealthLoading(false);
        }
      }
    };

    checkServiceHealth();
    const interval = setInterval(checkServiceHealth, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { id: "landing", label: "Overview", icon: ShieldCheck },
    { id: "analyzer", label: "Message Analyzer", icon: Search },
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "history", label: "History", icon: History },
    { id: "awareness", label: "Awareness Center", icon: BookOpen },
    { id: "about", label: "Model Info", icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => {
              onNavigate("landing");
              setMobileMenuOpen(false);
            }}
            className="flex items-center space-x-3 text-left group focus:outline-none"
          >
            <div className="relative p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 border border-cyan-500/30 group-hover:border-cyan-400 transition-colors">
              <ShieldCheck className="w-6 h-6 text-cyan-400 group-hover:scale-105 transition-transform" />
              <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  ScamShield
                </span>
                <span className="text-xs font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block tracking-tight">
                DistilBERT • Cyber Defense
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Cluster: Health Badge + Theme Toggle */}
          <div className="flex items-center space-x-3">
            {/* Live Model Health Badge */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all ${
                health?.model_loaded
                  ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/60"
                  : "bg-rose-950/40 text-rose-300 border-rose-800/60"
              }`}
              title={
                health?.model_loaded
                  ? `Model: ${health.model_name} on ${health.device.toUpperCase()}`
                  : "Backend disconnected. Run: uvicorn app.main:app --reload"
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  health?.model_loaded
                    ? "bg-emerald-400 animate-pulse"
                    : "bg-rose-500"
                }`}
              />
              <span className="font-medium">
                {isHealthLoading
                  ? "Connecting..."
                  : health?.model_loaded
                  ? `Model Ready (${health.device.toUpperCase()})`
                  : "Backend Offline"}
              </span>
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors focus:outline-none"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-400" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 bg-slate-900 border border-slate-800"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2.5 ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
