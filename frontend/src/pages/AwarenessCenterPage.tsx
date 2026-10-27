import React, { useState } from "react";
import {
  BookOpen,
  KeyRound,
  Link2,
  Gift,
  CreditCard,
  Briefcase,
  AlertOctagon,
  UserCheck,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";

interface AwarenessModule {
  id: string;
  title: string;
  icon: any;
  category: string;
  summary: string;
  redFlags: string[];
  sampleScript: string;
  defenseAction: string[];
}

const MODULES: AwarenessModule[] = [
  {
    id: "otp",
    title: "OTP & Two-Factor Authentication Interception",
    icon: KeyRound,
    category: "Credential Theft",
    summary:
      "Fraudsters pose as customer support, fraud detection officers, or bank officials claiming your card is compromised. They request the 6-digit OTP sent to your phone to 'cancel' or 'reverse' the transaction.",
    redFlags: [
      "Caller demands an OTP or PIN to 'cancel an unauthorized charge'.",
      "Receiving an OTP for a service you did not initiate (e.g. Google, WhatsApp, NetBanking).",
      "Aggressive pressure: 'Read the numbers quickly or your account will be permanently closed'.",
    ],
    sampleScript:
      "\"Dear customer, an unauthorized debit of $850 was attempted on your debit card. To stop this transaction immediately, please read out the 6-digit verification code sent to your mobile.\"",
    defenseAction: [
      "Banks and genuine services NEVER ask for OTPs or PINs over the phone or text.",
      "The SMS containing the OTP almost always says 'Do NOT share this code with anyone'. Read the message carefully.",
      "Hang up immediately and call the official customer care number printed on the back of your physical debit card.",
    ],
  },
  {
    id: "phishing_links",
    title: "Obfuscated Links & Domain Typosquatting",
    icon: Link2,
    category: "Technical Phishing",
    summary:
      "Cybercriminals use shortened links (bit.ly, is.gd) or mimic official domain names (e.g. paypa1-security.xyz instead of paypal.com) to lead targets to replica login pages that harvest credentials.",
    redFlags: [
      "URL uses atypical domain extensions such as .xyz, .top, .buzz, or .live for financial services.",
      "Shortened or disguised URLs in SMS messages claiming to be from delivery or utility companies.",
      "HTTP connection without valid HTTPS encryption or with mismatched SSL certificates.",
    ],
    sampleScript:
      "\"USPS Alert: Your package has been placed on hold due to missing street number. Please confirm your delivery details within 12 hours: http://bit.ly/usps-redelivery-fee\"",
    defenseAction: [
      "Never click links sent via unsolicited SMS. Manually type the official company domain into your browser.",
      "Use URL unshortening or inspection tools before visiting unfamiliar short links.",
      "Examine the address bar carefully: look for slight spelling changes or fake subdomain prefixes.",
    ],
  },
  {
    id: "fake_prize",
    title: "Unsolicited Lottery, Sweepstakes & Gift Cards",
    icon: Gift,
    category: "Reward Scams",
    summary:
      "Victims receive unexpected notifications that they have won a high-value jackpot, luxury car, or $1,000 shopping gift card from a contest they never entered.",
    redFlags: [
      "You 'won' a contest, lottery, or promotion you never bought a ticket for.",
      "The message requires you to claim the prize within a tight deadline (e.g., 'Expires in 2 hours').",
      "Conditioned on paying 'customs clearance', 'tax withholding', or a 'courier fee' first.",
    ],
    sampleScript:
      "\"CONGRATULATIONS! You have been randomly selected as our 1st prize winner for a $1,500 Amazon Gift Card. Claim your reward immediately before the quota ends: [link]\"",
    defenseAction: [
      "Rule of thumb: You cannot win a lottery you never participated in.",
      "Genuine sweepstakes deduct taxes directly or provide official audited verification letters—they never demand gift card or crypto payments.",
      "Delete and mark as spam.",
    ],
  },
  {
    id: "advance_fee",
    title: "Advance-Fee & Upfront Processing Scams",
    icon: CreditCard,
    category: "Financial Extortion",
    summary:
      "The target is promised a massive payout (an approved loan, inheritance, grant, or escrow fund), but must pay a 'small initial deposit' or 'government approval charge' to release the funds.",
    redFlags: [
      "Guaranteeing instant loans or grants with 'no credit check' but requiring a processing fee first.",
      "Requesting payment via non-reversible methods: cryptocurrency, Western Union, or Apple/Google Play gift cards.",
      "Requests for additional fees after each payment ('now the customs inspection fee is due').",
    ],
    sampleScript:
      "\"Your loan of $25,000 has been pre-approved at 2% interest. Please deposit a refundable document verification fee of $150 to activate your loan disbursement account.\"",
    defenseAction: [
      "Reputable financial institutions deduct processing charges directly from the loan amount rather than demanding upfront payments.",
      "Never send money to someone who promises to send you a larger sum in return.",
    ],
  },
  {
    id: "job_scam",
    title: "Part-Time Task & Telegram Recruitment Fraud",
    icon: Briefcase,
    category: "Employment Fraud",
    summary:
      "Scammers exploit job seekers by advertising effortless work-from-home gigs: liking YouTube videos, rating hotels, or reviewing apps. Initially, they pay small sums, then require large deposits for 'VIP task tiers'.",
    redFlags: [
      "Offers $300–$800 per day for 30 minutes of simple tasks (e.g. 'liking YouTube videos').",
      "Unsolicited WhatsApp, SMS, or Telegram messages from recruiters claiming to represent Amazon, TikTok, or Google.",
      "Demanding a security deposit or purchase of crypto to unlock advanced tasks.",
    ],
    sampleScript:
      "\"Hello! I am a recruiter from Global Media. We have remote part-time positions where you can earn $500 daily by simply rating movie trailers. Contact our Telegram supervisor @TaskManager99 to start now.\"",
    defenseAction: [
      "Legitimate employers never communicate critical hiring procedures exclusively over Telegram or WhatsApp.",
      "Real companies never charge applicants for training, equipment, or 'task deposit accounts'.",
      "Block the sender and report the group immediately.",
    ],
  },
  {
    id: "account_threat",
    title: "Bank Suspension & KYC Termination Threats",
    icon: AlertOctagon,
    category: "Coercive Phishing",
    summary:
      "Fear is the scammer's sharpest weapon. Messages falsely claim your bank account, credit card, or utility meter will be blocked today due to expired KYC or unpaid bills, triggering panic.",
    redFlags: [
      "Claims your electricity will be disconnected tonight or bank card permanently locked.",
      "Provides an unverified mobile number to call to 'resolve the emergency'.",
      "Directs you to download remote support applications (AnyDesk, TeamViewer) to 'fix the problem'.",
    ],
    sampleScript:
      "\"ALERT: Your HDFC Bank account will be DEACTIVATED within 24 hours due to non-updated PAN card KYC. Click here immediately to update or visit nearest branch.\"",
    defenseAction: [
      "Do not panic. Banks do not terminate accounts abruptly via SMS links.",
      "Never install screen-sharing software at the request of a caller or SMS.",
      "Log into your net banking account through your bookmark or official mobile app to verify your true status.",
    ],
  },
  {
    id: "impersonation",
    title: "Family Emergency & CEO / Executive Impersonation",
    icon: UserCheck,
    category: "Social Engineering",
    summary:
      "Criminals impersonate a family member who lost their phone, a stranded grandchild needing bail, or a company executive demanding an urgent wire transfer for an 'acquisition'.",
    redFlags: [
      "A message from an unknown number: 'Hey Mom, my phone broke, this is my new temporary number. Can you pay a bill for me quickly?'",
      "Boss asking you to buy gift cards for a client meeting right now without calling them.",
      "Insistence on secrecy: 'Do not tell anyone about this yet'.",
    ],
    sampleScript:
      "\"Hi Dad, I dropped my phone in the water. I'm using a friend's phone. I urgently need $400 to pay for car towing before the shop closes. Can you transfer to this account?\"",
    defenseAction: [
      "Always call your family member on their known original number first to verify.",
      "Establish a family secret safe-word for genuine emergency verification.",
      "Never authorize financial transfers based solely on a text message or messaging app.",
    ],
  },
];

export const AwarenessCenterPage: React.FC = () => {
  const [expandedModule, setExpandedModule] = useState<string>("otp");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <BookOpen className="w-4 h-4" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Scam Awareness & Threat Encyclopedia
          </h1>
        </div>
        <p className="text-sm text-slate-400">
          Deconstruct common cyber fraud tactics, social engineering psychological triggers, and practical countermeasures.
        </p>
      </div>

      {/* Human Curated Advisory Note */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-white">Cybersecurity Notice:</strong> The threat patterns, attack scripts, and defense guidelines below are human-curated educational intelligence. They are maintained independently of the DistilBERT model weights to provide authoritative defense knowledge.
        </p>
      </div>

      {/* Accordion / Module List */}
      <div className="space-y-4">
        {MODULES.map((mod) => {
          const Icon = mod.icon;
          const isExpanded = expandedModule === mod.id;

          return (
            <div
              key={mod.id}
              className={`rounded-2xl border transition-all ${
                isExpanded
                  ? "bg-slate-900/90 border-cyan-500/40 shadow-xl"
                  : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
              }`}
            >
              {/* Header Bar */}
              <button
                onClick={() =>
                  setExpandedModule(isExpanded ? "" : mod.id)
                }
                className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl border ${
                      isExpanded
                        ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                        {mod.category}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {mod.title}
                    </h3>
                  </div>
                </div>

                <div className="text-slate-400">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </button>

              {/* Collapsible Content */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 space-y-5 text-xs sm:text-sm animate-fadeIn">
                  {/* Summary */}
                  <div>
                    <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">
                      Modus Operandi:
                    </h4>
                    <p className="text-slate-300 leading-relaxed">
                      {mod.summary}
                    </p>
                  </div>

                  {/* Red Flags */}
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      Critical Red Flags:
                    </h4>
                    <ul className="space-y-1.5 text-slate-300">
                      {mod.redFlags.map((rf, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                          <span>{rf}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sample Anatomy */}
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                    <h4 className="text-xs font-mono text-amber-300 uppercase font-semibold">
                      Anatomy of an Attack Message:
                    </h4>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-amber-100/90 italic">
                      {mod.sampleScript}
                    </div>
                  </div>

                  {/* Defense Checklist */}
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                    <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      Recommended Countermeasures:
                    </h4>
                    <ul className="space-y-1.5 text-slate-300">
                      {mod.defenseAction.map((da, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                          <span>{da}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
