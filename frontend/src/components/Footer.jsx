import Link from "next/link";
import { Phone, CheckCircle2, Handshake } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#122844] text-slate-300 border-t border-[#23487A] mt-auto">
      {/* Helplines Strip in Deep Saturated Indigo */}
      <div className="bg-[#1A365D] border-b border-[#23487A] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          <div className="flex items-start gap-3.5 bg-[#122844] p-4 rounded-xl border border-[#23487A]">
            <div className="p-2.5 bg-[#FF9F00]/20 text-[#FF9F00] rounded-lg shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold">{t("footer.nationalHelpline")}</div>
              <div className="text-[#FF9F00] font-extrabold text-base tracking-wide">1800-11-2001</div>
              <div className="text-xs text-slate-300 mt-0.5">{t("nav.tollFree")}, 24x7</div>
            </div>
          </div>

          <div className="flex items-start gap-3.5 bg-[#122844] p-4 rounded-xl border border-[#23487A]">
            <div className="p-2.5 bg-[#00A3C4]/20 text-[#00A3C4] rounded-lg shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold">{t("footer.kisanHelpline")}</div>
              <div className="text-[#00A3C4] font-extrabold text-base tracking-wide">155261</div>
              <div className="text-xs text-slate-300 mt-0.5">{t("nav.tollFree")}</div>
            </div>
          </div>

          <div className="flex items-start gap-3.5 bg-[#122844] p-4 rounded-xl border border-[#23487A]">
            <div className="p-2.5 bg-[#FF9F00]/20 text-[#FF9F00] rounded-lg shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold">{t("footer.healthHelpline")}</div>
              <div className="text-[#FF9F00] font-extrabold text-base tracking-wide">14555</div>
              <div className="text-xs text-slate-300 mt-0.5">{t("nav.tollFree")}</div>
            </div>
          </div>

          <div className="flex items-start gap-3.5 bg-[#122844] p-4 rounded-xl border border-[#23487A]">
            <div className="p-2.5 bg-[#00A3C4]/20 text-[#00A3C4] rounded-lg shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold">{t("footer.womenHelpline")}</div>
              <div className="text-[#00A3C4] font-extrabold text-base tracking-wide">181 / 1098</div>
              <div className="text-xs text-slate-300 mt-0.5">{t("nav.tollFree")}</div>
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
              <div className="w-8 h-8 bg-[#FF9F00] text-[#171717] rounded-lg flex items-center justify-center">
                <Handshake className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-black text-white">{t("nav.title")}</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t("footer.platformDesc")}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#00A3C4] font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t("footer.wcag")}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider border-b border-[#23487A] pb-1.5">
              {t("footer.features")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  {t("nav.voiceAssistant")}
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-white transition-colors">
                  {t("nav.searchSchemes")}
                </Link>
              </li>
              <li>
                <a href="#categories" className="hover:text-white transition-colors">
                  {t("categories.agriculture")}
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-white transition-colors">
                  {t("categories.women")}
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-white transition-colors">
                  {t("categories.education")}
                </a>
              </li>
            </ul>
          </div>

          {/* Regional Audio Access */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider border-b border-[#23487A] pb-1.5">
              {t("footer.regionalAccess")}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t("footer.regionalDesc")}
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-200">
              <span className="bg-[#1A365D] px-3 py-1 rounded-full border border-[#23487A]">English</span>
              <span className="bg-[#1A365D] px-3 py-1 rounded-full border border-[#23487A]">हिन्दी (Hindi)</span>
              <span className="bg-[#1A365D] px-3 py-1 rounded-full border border-[#23487A]">বাংলা (Bengali)</span>
            </div>
          </div>

          {/* Informatics Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider border-b border-[#23487A] pb-1.5">
              {t("footer.integrity")}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t("footer.integrityDesc")}
            </p>
            <div className="text-[11px] text-slate-400 pt-2">
              All schemes reference authentic <code className="text-[#FF9F00] font-bold">.gov.in</code> official resources.
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-10 pt-6 border-t border-[#23487A] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} {t("footer.copyright")}
          </div>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span>WCAG AAA Accessible</span>
            <span>•</span>
            <span>Zero Data Profiling</span>
            <span>•</span>
            <span>Open Civic Technology</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
