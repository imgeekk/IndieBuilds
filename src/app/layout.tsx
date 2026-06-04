import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "IndieBuilds",
  description: "What indie devs shipped this week",
  openGraph: {
    title: "IndieBuilds",
    description: "What indie devs shipped this week",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "IndieBuilds",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "IndieBuilds",
    description: "What indie devs shipped this week",
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
