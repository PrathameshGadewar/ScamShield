import React from "react";
import {
  Info,
  Cpu,
  Database,
  Layers,
  AlertTriangle,
  Code2,
  CheckCircle2,
} from "lucide-react";

export const AboutModelPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10 animate-fadeIn">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Info className="w-4 h-4" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Model Architecture & Engineering
          </h1>
        </div>
        <p className="text-sm text-slate-400">
          Technical specifications, neural network configuration, hybrid methodology, and known domain boundaries.
        </p>
      </div>

      {/* Project Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Code2 className="w-5 h-5 text-cyan-400" />
          <span>ScamShield AI — Academic Background</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Developed as part of <strong>CSE472: Deep Learning for Natural Language Processing (5th Semester B.Tech)</strong>. The project addresses the critical challenge of conversational security: detecting social engineering and malicious intent in text communications through natural language representations combined with defensive heuristic guardrails.
        </p>
      </div>

      {/* DistilBERT Architecture Specs */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span>DistilBERT Model Specifications</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The core machine learning classifier is based on <code>distilbert-base-uncased</code>, fine-tuned for binary sequence classification (Class 0: Legitimate / Ham, Class 1: Fraudulent / Spam). DistilBERT retains approximately 97% of BERT's language understanding while being 40% smaller and 60% faster, making it suitable for responsive local inference.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">
              Layers
            </div>
            <div className="text-lg font-bold text-cyan-400 font-mono">6</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">
              Attention Heads
            </div>
            <div className="text-lg font-bold text-cyan-400 font-mono">12</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">
              Hidden Dim
            </div>
            <div className="text-lg font-bold text-cyan-400 font-mono">768</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">
              Parameters
            </div>
            <div className="text-lg font-bold text-cyan-400 font-mono">~66M</div>
          </div>
        </div>

        <div className="text-xs text-slate-400 space-y-1 pt-2 font-mono">
          <div>• Base Tokenizer: WordPiece (30,522 vocabulary entries)</div>
          <div>• Sequence Length: 512 tokens maximum</div>
          <div>• Inference Pipeline: PyTorch with Softmax probability normalization</div>
        </div>
      </div>

      {/* Dataset & Training Workflow */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-400" />
          <span>Training Corpus: UCI SMS Spam Collection</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The model was originally trained using the standard academic <strong>UCI SMS Spam Collection</strong> dataset, which contains 5,574 labeled English SMS messages (4,827 legitimate ham messages and 747 spam messages).
        </p>
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-1.5 leading-relaxed">
          <strong className="text-slate-200">Historical Perspective:</strong> The UCI dataset provides an established benchmark for general SMS spam patterns (e.g. ringtone subscriptions, dating spam, classic prize notifications). However, the linguistic distribution of modern digital crime has shifted substantially toward banking smishing, OTP hijacking, UPI coercion, and fake delivery notifications.
        </div>
      </div>

      {/* Why the Hybrid Approach is Essential */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-400" />
          <span>The Hybrid AI & Heuristic Strategy</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Relying exclusively on a statistical language model creates dangerous blind spots. A newly worded scam that avoids traditional spam keywords may receive a low statistical probability from an SMS-trained model. To prevent catastrophic false negatives:
        </p>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">Safety Override Rule:</strong> If high-severity heuristic patterns (such as requesting an OTP, threatening imminent bank account closure, or demanding an advance fee) are detected, the system immediately flags the message as <span className="text-rose-400 font-bold">SUSPICIOUS</span>, irrespective of whether the DistilBERT probability is low.
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">Complementary Sensitivity:</strong> The DistilBERT neural model catches subtle structural patterns, urgency undertones, and marketing spam structures that do not match specific keyword regexes.
            </div>
          </div>
        </div>
      </div>

      {/* Honest Limitations & Domain Boundaries */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          <span>Known Limitations & Edge Cases</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          In alignment with sound scientific principles, ScamShield AI explicitly documents its constraints:
        </p>

        <ul className="space-y-2.5 text-xs text-slate-300">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
            <span>
              <strong>Domain Shift:</strong> Modern conversational scams (e.g. pig-butchering romance fraud, nuanced spear-phishing) span long multi-turn interactions and may look identical to normal friendly conversation in a single message.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
            <span>
              <strong>False Positives:</strong> Legitimate automated messages (such as automated flight notifications, one-time security login alerts sent by your own bank, or discount promotional codes) may occasionally trigger high statistical spam scores or heuristic keyword flags.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
            <span>
              <strong>Multilingual Scope:</strong> The current model and rule sets are primarily evaluated on English language text. Messages in other regional languages or code-mixed dialects (e.g. Hinglish) may exhibit degraded accuracy.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
            <span>
              <strong>Advisory Nature:</strong> An unflagged output does not certify that a message is authentic. Attackers continuously adapt evasion techniques.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
