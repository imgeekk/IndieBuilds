import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IndieBuilds",
  description: "What indie devs shipped this week",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
