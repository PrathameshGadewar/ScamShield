import React, { useState } from "react";
import {
  Search,
  Sparkles,
  Lock,
  Cpu,
  Sliders,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { SamplePrompts } from "../components/SamplePrompts";

interface LandingPageProps {
  onNavigateToAnalyzer: (initialText?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToAnalyzer,
}) => {
  const [demoInput, setDemoInput] = useState(
    "Send me your OTP immediately or your bank account will be blocked."
  );

  return (
    <div className="space-y-20 pb-12">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 text-center max-w-4xl mx-auto px-4">
        {/* Subtle glow background */}
        <div className="absolute inset-0 -top-12 -z-10 flex items-center justify-center">
          <div className="w-[500px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="w-[400px] h-[250px] bg-emerald-500/10 rounded-full blur-3xl -ml-20" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 text-xs font-mono mb-6">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>CSE472 Deep Learning for NLP Project</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight sm:leading-none">
          Stay One Step Ahead{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            of Digital Scams.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Intelligent scam detection powered by fine-tuned DistilBERT transformer sequence classification and real-time behavioral heuristics. Detect deception before it costs you.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onNavigateToAnalyzer()}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Analyze a Message</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#features"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700/80 hover:border-slate-600 transition-colors flex items-center justify-center gap-2"
          >
            <span>Explore Features</span>
          </a>
        </div>

        {/* Live Interactive Quick-Demo Box */}
        <div className="mt-12 text-left bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-slate-950/80">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2">
                Live Interactive Sandbox
              </span>
            </div>
            <span className="text-xs font-mono text-cyan-400">
              DistilBERT + Heuristic Pipeline
            </span>
          </div>

          <div className="mt-4 space-y-4">
            <SamplePrompts
              onSelect={(sampleText) => setDemoInput(sampleText)}
            />

            <div className="relative">
              <textarea
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                rows={3}
                className="w-full rounded-xl bg-slate-950/70 border border-slate-700/80 p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none font-mono"
                placeholder="Type or select a message above..."
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Ready to evaluate with neural network & rule engine
              </span>
              <button
                onClick={() => onNavigateToAnalyzer(demoInput)}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>Launch Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Advisory Callout */}
        <div className="mt-6 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 text-xs text-slate-400 flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Predictions are advisory. ScamShield AI assists in identifying risk patterns but cannot guarantee an unflagged message is safe.
          </span>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Comprehensive Defense Against Social Engineering
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Modern scams combine psychological urgency, obfuscated domains, and credential phishing. Our hybrid engine tackles both linguistic traits and explicit threat signatures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="rounded-xl p-6 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Fine-Tuned DistilBERT
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transformer sequence classification trained to recognize statistical nuances, syntax anomalies, and fraudulent intent in text messages.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-xl p-6 bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Multi-Vector Heuristics
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Independent rule engine evaluates 8 distinct threat vectors including OTP theft, account freezes, advance fees, and obfuscated domains.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-xl p-6 bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Transparent Explanations
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No black-box opacity. Inspect exact matched phrases, confidence scores, and plain-English reasons why a message triggered alerts.
            </p>
          </div>

          {/* Card 4 */}
          <div className="rounded-xl p-6 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Local & Private
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inference runs locally through your Python server. Analysis history persists in a local SQLite file without leaking to external cloud APIs.
            </p>
          </div>
        </div>
      </section>

      {/* Hybrid Architecture Diagram / Explainer */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              The Hybrid Decision Engine
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Why machine learning alone is never sufficient for scam detection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
              <div className="text-xs font-mono text-cyan-400 uppercase font-semibold">
                Vector 1: Neural Classifier
              </div>
              <p className="text-xs text-slate-300">
                DistilBERT evaluates vocabulary distribution and context representations to generate a statistical spam probability.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center py-2 text-slate-500 font-mono text-xs font-bold">
              <span>+</span>
              <span className="text-[10px] text-cyan-400">COMBINED SYNTHESIS</span>
              <span>=</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
              <div className="text-xs font-mono text-amber-400 uppercase font-semibold">
                Vector 2: Rule Heuristics
              </div>
              <p className="text-xs text-slate-300">
                Pattern matching checks for critical red flags like OTP solicitation, bank threats, or advance fees that bypass statistical models.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-center">
            <span className="text-xs font-semibold text-slate-200">
              Verdict Guarantee: If either the model confidence is high (≥ 50%) OR any critical rule indicator triggers, the message is marked <strong className="text-rose-400">SUSPICIOUS</strong>.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
