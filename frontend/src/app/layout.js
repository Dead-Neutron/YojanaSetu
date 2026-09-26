import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "YojanaSetu | Modern Citizen Welfare Access Portal",
  description: "Dismantling literacy and digital barriers. Speak in your regional mother tongue to discover, understand, and apply for Indian Central and State government welfare schemes.",
  keywords: "YojanaSetu, government schemes, Indian welfare, voice schemes search, myScheme, PM Kisan, citizen portal, Bento grid",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`h-full ${inter.className}`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="min-h-full flex flex-col antialiased bg-[#070d17] text-[#CBD5E1]" suppressHydrationWarning>
        <AuthProvider>
          <LanguageProvider>
            <AccessibilityProvider>
              {children}
            </AccessibilityProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
