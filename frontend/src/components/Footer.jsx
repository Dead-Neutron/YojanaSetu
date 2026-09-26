import Link from "next/link";
import { Phone, CheckCircle2, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950/80 text-slate-300 border-t border-white/[0.08] backdrop-blur-xl mt-auto">
      {/* Helplines Strip in Frosted Obsidian */}
      <div className="bg-slate-900/60 border-b border-white/[0.08] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          <div className="flex items-start gap-3.5 bg-slate-800/50 p-4 rounded-2xl border border-white/[0.06] backdrop-blur-md">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-slate-100 font-bold">{t("footer.nationalHelpline") || "National Citizen Helpline"}</div>
              <div className="text-amber-400 font-extrabold text-base tracking-wide">1800-11-2001</div>
              <div className="text-xs text-slate-400 mt-0.5">{t("nav.tollFree") || "Toll-Free"}, 24x7</div>
            </div>
          </div>

          <div className="flex items-start gap-3.5 bg-slate-800/50 p-4 rounded-2xl border border-white/[0.06] backdrop-blur-md">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-slate-100 font-bold">{t("footer.kisanHelpline") || "Kisan Support Call Center"}</div>
              <div className="text-emerald-400 font-extrabold text-base tracking-wide">155261</div>
              <div className="text-xs text-slate-400 mt-0.5">{t("nav.tollFree") || "Toll-Free"}</div>
            </div>
          </div>

          <div className="flex items-start gap-3.5 bg-slate-800/50 p-4 rounded-2xl border border-white/[0.06] backdrop-blur-md">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-slate-100 font-bold">{t("footer.healthHelpline") || "Ayushman Health Desk"}</div>
              <div className="text-amber-400 font-extrabold text-base tracking-wide">14555</div>
              <div className="text-xs text-slate-400 mt-0.5">{t("nav.tollFree") || "Toll-Free"}</div>
            </div>
          </div>

          <div className="flex items-start gap-3.5 bg-slate-800/50 p-4 rounded-2xl border border-white/[0.06] backdrop-blur-md">
            <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-slate-100 font-bold">{t("footer.womenHelpline") || "Women & Child Care"}</div>
              <div className="text-cyan-400 font-extrabold text-base tracking-wide">181 / 1098</div>
              <div className="text-xs text-slate-400 mt-0.5">{t("nav.tollFree") || "Toll-Free"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Platform Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-extrabold text-slate-50 tracking-tight">{t("nav.title") || "YojanaSetu"}</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {t("footer.platformDesc") ||
                "A national civic empowerment platform dismantling literacy and digital barriers through vernacular voice AI and direct welfare entitlement discovery."}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t("footer.wcag") || "WCAG 2.2 AAA Verified Access"}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-slate-100 font-bold text-xs uppercase tracking-wider border-b border-white/[0.08] pb-1.5">
              {t("footer.features") || "Platform Portals"}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  {t("nav.voiceAssistant") || "Voice Assistant"}
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-amber-400 transition-colors">
                  {t("nav.searchSchemes") || "Scheme Directory"}
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="hover:text-amber-400 transition-colors">
                  Personalized Eligibility
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors font-medium">
                  {t("nav.about") || "About Platform & Architecture"}
                </Link>
              </li>
              <li>
                <Link href="/search?category=Agriculture" className="hover:text-amber-400 transition-colors">
                  {t("categories.agriculture") || "Agriculture Subsidies"}
                </Link>
              </li>
              <li>
                <Link href="/search?category=Women%20and%20Child" className="hover:text-amber-400 transition-colors">
                  {t("categories.women") || "Women & Child Care"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Regional Audio Access */}
          <div className="space-y-3">
            <h4 className="text-slate-100 font-bold text-xs uppercase tracking-wider border-b border-white/[0.08] pb-1.5">
              {t("footer.regionalAccess") || "Multilingual Synthesis"}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {t("footer.regionalDesc") ||
                "Listen to schemes spoken naturally in your native dialect with read-along text synchronization."}
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-200">
              <span className="bg-slate-800/80 px-3 py-1 rounded-full border border-white/[0.08]">English</span>
              <span className="bg-slate-800/80 px-3 py-1 rounded-full border border-white/[0.08]">हिन्दी (Hindi)</span>
              <span className="bg-slate-800/80 px-3 py-1 rounded-full border border-white/[0.08]">বাংলা (Bengali)</span>
            </div>
          </div>

          {/* Informatics Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-slate-100 font-bold text-xs uppercase tracking-wider border-b border-white/[0.08] pb-1.5">
              {t("footer.integrity") || "Data Sovereignty"}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {t("footer.integrityDesc") ||
                "All schemes reference authentic .gov.in official government gazettes with zero middleman interference."}
            </p>
            <div className="text-[11px] text-slate-400 pt-2">
              Source verified against official <code className="text-amber-400 font-bold">.gov.in</code> &amp; <code className="text-amber-400 font-bold">.nic.in</code> gazettes.
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-10 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <div>
            © 2026 {t("footer.copyright") || "YojanaSetu • Ministry & Civic Open Technology Initiative"}
          </div>
          <div className="flex items-center gap-4 mt-2 sm:mt-0 font-medium">
            <span>WCAG AAA Accessible</span>
            <span>•</span>
            <span>Zero Data Profiling</span>
            <span>•</span>
            <span>Direct Benefit Transfer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
