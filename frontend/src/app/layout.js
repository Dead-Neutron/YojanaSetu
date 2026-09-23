import "./globals.css";

export const metadata = {
  title: "YojanaSetu | AI-Powered Multilingual Citizen Welfare Assistant",
  description: "Dismantling literacy and digital barriers. Speak in your regional mother tongue to discover, understand, and apply for Indian Central and State government welfare schemes.",
  keywords: "YojanaSetu, government schemes, Indian welfare, voice schemes search, myScheme, PM Kisan, citizen portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
