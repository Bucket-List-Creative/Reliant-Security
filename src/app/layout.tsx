import type { Metadata } from "next";
import { SITE_URL } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Reliant Security — Premium home & business security",
    template: "%s · Reliant Security",
  },
  description:
    "Reliant Security designs, installs, and monitors premium home and business security systems with 24/7 rapid response.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
