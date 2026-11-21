import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "SayLess | Say less. Mean more.",
  description: "Discover your communication habits and practice saying what matters.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
