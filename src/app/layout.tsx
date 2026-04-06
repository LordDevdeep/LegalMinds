import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LegalMinds — AI Legal Analysis for Indian Law",
  description:
    "Get structured legal guidance on Indian law. Analyze your legal situation with AI-powered insights covering applicable laws, penalties, and recommended actions.",
  keywords: ["Indian law", "legal analysis", "AI legal advisor", "legal guidance"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
