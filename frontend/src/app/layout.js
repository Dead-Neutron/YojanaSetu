import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import AccessibilityDrawer from "@/components/AccessibilityDrawer";

export const metadata = {
  title: "YojanaSetu | Modern Citizen Welfare Access Portal",
  description: "Dismantling literacy and digital barriers. Speak in your regional mother tongue to discover, understand, and apply for Indian Central and State government welfare schemes.",
  keywords: "YojanaSetu, government schemes, Indian welfare, voice schemes search, myScheme, PM Kisan, citizen portal, Bento grid",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="min-h-full flex flex-col antialiased bg-[#F8FAFC] text-[#0F172A]">
        <LanguageProvider>
          <AccessibilityProvider>
            {children}
            <AccessibilityDrawer />
          </AccessibilityProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
