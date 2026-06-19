import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rakumon SNS Studio",
  description: "AI-powered SNS content generation and management for Rakumon marketing operations."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
