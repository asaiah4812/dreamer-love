import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import BottonNav from "@/components/bottonNav";
// Load Montserrat font
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Love Notes | Send Beautiful Messages",
  description: "Send beautiful love messages to your special someone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body suppressHydrationWarning>
        {children}
        <BottonNav/>
      </body>
    </html>
  );
}

