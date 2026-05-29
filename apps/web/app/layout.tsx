import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PsycheHire AI",
  description: "Enterprise psychometric assessment and workforce intelligence platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

