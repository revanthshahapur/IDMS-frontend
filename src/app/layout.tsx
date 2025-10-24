// src/app/layout.tsx (Pure Server Component)
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

// ✅ Import the Client Wrapper
import ClientWrapper from "./components/ClientWrapper"; 


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ UPDATED Metadata for greytHR theme
export const metadata: Metadata = {
  title: "Tiranga IDMS",
  description: "Simplify HR, payroll, attendance, and compliance with India's most trusted cloud-based HR management system. Request a free demo today.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Pass children to the wrapper, which will handle client-side logic (DisableInspect, Watermark) */}
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}