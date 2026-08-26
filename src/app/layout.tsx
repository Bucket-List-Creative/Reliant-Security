import type { Metadata } from "next";
import { SITE_URL } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Reliant Security — Security & low-voltage integration",
    template: "%s · Reliant Security",
  },
  description:
    "Locally owned security and low-voltage integrator serving homes, custom homes, multi-family, commercial, industrial, and government facilities — video surveillance, access control, structured cabling and fiber, audio/video, and 24/7 professional monitoring.",
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
