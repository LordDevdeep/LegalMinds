import type { Metadata } from "next";
import { LanguageProvider } from "@/i18n/LanguageContext";
import DisclaimerModal from "@/components/DisclaimerModal";
import "./globals.css";

export const metadata: Metadata = {
  title: "LegalMinds — AI Legal Analysis for Indian Law",
  description:
    "Get structured legal information on Indian law. Analyze your legal situation with AI-powered insights covering applicable laws, penalties, and recommended actions.",
  keywords: ["Indian law", "legal analysis", "AI legal information", "legal information"],
  icons: {
    icon: "/favicon.png",
    apple: "/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <LanguageProvider>
          <DisclaimerModal />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
