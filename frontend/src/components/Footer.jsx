import Link from "next/link";
import { Phone, Globe, Shield, HeartHandshake, CheckCircle2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0B1120] text-slate-300 border-t-4 border-[#D97706] mt-auto">
      {/* Helpdesk & Toll Free Banner */}
      <div className="bg-[#0F172A] border-b border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#D97706] text-slate-950 rounded font-black">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold">National Citizen Helpline</div>
              <div className="text-amber-400 font-extrabold text-base">1800-11-2001</div>
              <div className="text-xs text-slate-400">Toll-Free, 24x7 Multi-lingual</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#047857] text-white rounded font-black">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold">PM-KISAN Samman Nidhi</div>
              <div className="text-emerald-400 font-extrabold text-base">155261 / 011-24300606</div>
              <div className="text-xs text-slate-400">Dedicated Farmers Welfare</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#D97706] text-slate-950 rounded font-black">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold">Ayushman Bharat Health</div>
              <div className="text-amber-400 font-extrabold text-base">14555 / 1800-111-565</div>
              <div className="text-xs text-slate-400">Universal Medical Cover</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#047857] text-white rounded font-black">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold">Women & Child Helpline</div>
              <div className="text-emerald-400 font-extrabold text-base">181 / 1098</div>
              <div className="text-xs text-slate-400">Immediate Support & Relief</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Platform Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#D97706] text-slate-950 font-black rounded flex items-center justify-center text-sm">
                YS
              </div>
              <span className="text-xl font-black text-white">YojanaSetu</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              An inclusive, AI-powered multilingual assistant helping every Indian citizen discover and apply for government welfare schemes without literacy or digital barriers.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>WCAG 2.1 AAA Accessibility Compliant</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base uppercase tracking-wider text-xs border-b border-slate-700 pb-1">
              Platform Features
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-400 flex items-center gap-2">
                  <span>🎤 Voice Assistant (आवाज़ से खोजें)</span>
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-amber-400 flex items-center gap-2">
                  <span>🔍 MyScheme Search (योजना खोजें)</span>
                </Link>
              </li>
              <li>
                <a href="#categories" className="hover:text-amber-400">
                  Farmer & Agriculture Schemes
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-amber-400">
                  Women Empowerment & Self-Help
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-amber-400">
                  Student Education & Scholarships
                </a>
              </li>
            </ul>
          </div>

          {/* Languages Supported */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base uppercase tracking-wider text-xs border-b border-slate-700 pb-1">
              Regional Audio Access
            </h4>
            <p className="text-xs text-slate-400">
              Speak and listen in 8+ recognized Indian languages with native accent translation powered by Gemini Flash and ElevenLabs:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 font-medium">
              <span className="bg-[#1E293B] px-2 py-1 rounded">हिन्दी (Hindi)</span>
              <span className="bg-[#1E293B] px-2 py-1 rounded">বাংলা (Bengali)</span>
              <span className="bg-[#1E293B] px-2 py-1 rounded">తెలుగు (Telugu)</span>
              <span className="bg-[#1E293B] px-2 py-1 rounded">मराठी (Marathi)</span>
              <span className="bg-[#1E293B] px-2 py-1 rounded">தமிழ் (Tamil)</span>
              <span className="bg-[#1E293B] px-2 py-1 rounded">English</span>
            </div>
          </div>

          {/* Official Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base uppercase tracking-wider text-xs border-b border-slate-700 pb-1">
              National Informatics & Integrity
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scheme information is ingested from verified central ministries and state gazettes. YojanaSetu does not charge any citizen fee for scheme discovery or application guidance.
            </p>
            <div className="text-xs text-slate-500 pt-2">
              All links redirect to authentic <code className="text-amber-300">.gov.in</code> or <code className="text-amber-300">.nic.in</code> portals.
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} YojanaSetu Platform. Public Welfare Initiative for HackNex.
          </div>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span>Security & Privacy</span>
            <span>•</span>
            <span>Terms of Access</span>
            <span>•</span>
            <span>MyScheme Interoperability</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
