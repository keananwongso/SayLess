import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SayLess | Say less. Mean more.",
  description: "Discover your communication habits and practice saying what matters.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
